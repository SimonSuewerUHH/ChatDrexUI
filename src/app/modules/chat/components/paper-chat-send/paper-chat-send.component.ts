import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {sendMessage} from '../../service/paper-chat.actions';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextFieldModule} from '@angular/cdk/text-field';
import {toolTips} from '../../../../utils/models/tool-tips';

import {
  selectConnected,
  selectCurrentMessages,
  selectReconnectAttempt,
  selectReconnectNextRetryMs,
} from '../../service/paper-chat.selector';
import {ConversationPart} from '../../dto/message';

interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-paper-chat-send',
  imports: [
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './paper-chat-send.component.html',
  styleUrl: './paper-chat-send.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatSendComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  readonly threadId = input<string>();
  readonly sendDirectly = input<boolean>(true);
  readonly startMessage = input<string>('');
  readonly deactivated = input<boolean>(false);

  readonly connected = this.store.selectSignal(selectConnected);
  readonly reconnectAttempt = this.store.selectSignal(selectReconnectAttempt);
  readonly reconnectNextMs = this.store.selectSignal(selectReconnectNextRetryMs);
  private readonly currentMessages = this.store.selectSignal(selectCurrentMessages);

  readonly statusText = computed(() => {
    if (this.connected()) {
      return 'Online';
    }
    const attempt = this.reconnectAttempt();
    if (attempt > 0) {
      return `Reconnecting… (attempt ${attempt})`;
    }
    return 'Offline';
  });

  readonly statusTooltip = computed(() => {
    if (this.connected()) {
      return 'Connected to ChatDrex';
    }
    const ms = this.reconnectNextMs();
    if (ms > 0) {
      return `Next retry in ${Math.round(ms / 1000)}s`;
    }
    return 'Not connected';
  });

  /** True while the last message is human and no AI bubble has started replying. */
  readonly waitingForReply = computed(() => {
    const msgs = this.currentMessages();
    if (msgs.length === 0) {
      return false;
    }
    const last = msgs[msgs.length - 1] as ConversationPart;
    return last?.isHuman === true;
  });

  readonly isBusy = computed(() => this.waitingForReply());
  readonly canSend = computed(
    () => this.connected() && !this.deactivated() && this.messageValue().trim().length > 0,
  );

  /** Track input value as a signal so canSend recomputes without explicit cdr.detectChanges. */
  private readonly messageValue = signal('');

  newMessage = output<string>();

  message: string = '';

  options: Option[] = [];
  filteredOptions: Option[] = [];
  unknownCommand = false;

  ngOnInit() {
    this.message = this.startMessage() || '';
    this.options = toolTips.map(tip => ({label: tip.explanation, value: tip.command}));
  }

  setStartMessage = effect(() => {
    const start = this.startMessage() || '';
    this.message = start;
    this.messageValue.set(start);
  });

  /** Enter submits; Shift+Enter inserts a newline (standard chat-UX). */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.send();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    const value = (event.target as HTMLTextAreaElement | HTMLInputElement).value;
    this.message = value;
    this.messageValue.set(value);
    const trimmed = value.trim();
    if (trimmed.startsWith('/')) {
      const firstToken = trimmed.split(/\s+/)[0];
      this.filteredOptions = this.options.filter(option =>
        option.value.startsWith(firstToken),
      );
      const isKnown = this.options.some(option => option.value === firstToken);
      this.unknownCommand = !isKnown && this.filteredOptions.length === 0;
    } else {
      this.filteredOptions = [];
      this.unknownCommand = false;
    }
    this.cdr.detectChanges();
  }

  displayOption(option: any): string {
    return option?.value || '';
  }

  send(): void {
    if (!this.canSend() || this.isBusy()) {
      return;
    }
    const text = this.message;
    if (this.sendDirectly() && this.threadId()) {
      this.store.dispatch(sendMessage({threadId: this.threadId()!, message: text}));
    } else {
      this.newMessage.emit(text);
    }
    this.message = '';
    this.messageValue.set('');
    this.unknownCommand = false;
    this.filteredOptions = [];
    this.cdr.detectChanges();
  }
}
