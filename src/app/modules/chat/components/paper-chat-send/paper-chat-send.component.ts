import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output
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
import {toolTips} from '../../../../utils/models/tool-tips';

import {toSignal} from '@angular/core/rxjs-interop';
import {selectConnected} from '../../service/paper-chat.selector';

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
    MatIconModule
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

  connected = toSignal(this.store.select(selectConnected), {initialValue: false});

  newMessage = output<string>();

  message: string = '';

  options: Option[] = [];
  filteredOptions: Option[] = [];

  ngOnInit() {
    this.message = this.startMessage() || '';
    this.options = toolTips.map(tip => ({label: tip.explanation, value: tip.command}));
  }

  setStartMessage = effect(() => {
    this.message = this.startMessage() || '';
  });


  onKeyUp(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    this.message = input;
    if (input.startsWith('/')) {
      this.filteredOptions = this.options.filter(option =>
        option.value.startsWith(input)
      );
    } else {
      this.filteredOptions = [];
    }
    this.cdr.detectChanges();
  }

  displayOption(option: any): string {
    return option?.value || '';
  }

  send(): void {
    if (this.message) {
      if (this.sendDirectly() && this.threadId()) {
        this.store.dispatch(
          sendMessage({threadId: this.threadId()!, message: this.message})
        );
      } else {
        this.newMessage.emit(this.message);
      }
      this.message = '';
    }
    this.cdr.detectChanges();
  }
}
