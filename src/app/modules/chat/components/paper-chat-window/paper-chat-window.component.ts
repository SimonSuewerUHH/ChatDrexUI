import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  inject, Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Store} from '@ngrx/store';
import {connectToChat, disconnect} from '../../service/paper-chat.actions';
import {PaperChatSendingBubbleComponent} from '../paper-chat-sending-bubble/paper-chat-sending-bubble.component';
import {PaperChatReceivingBubbleComponent} from '../paper-chat-receiving-bubble/paper-chat-receiving-bubble.component';
import {PaperChatSendComponent} from '../paper-chat-send/paper-chat-send.component';
import {EMPTY, Observable, Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {PaperChatSettingDialogComponent} from '../paper-chat-setting-dialog/paper-chat-setting-dialog.component';
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {selectConnected, selectCurrentMessages, selectCurrentThreadId} from '../../service/paper-chat.selector';
import {ConversationPart} from '../../dto/message';

@Component({
  selector: 'app-paper-chat-window',
  imports: [
    PaperChatSendingBubbleComponent,
    PaperChatReceivingBubbleComponent,
    PaperChatSendComponent,
    AsyncPipe
  ],
  templateUrl: './paper-chat-window.component.html',
  styleUrl: './paper-chat-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperChatWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly clickEventService: ClickEventService = inject(ClickEventService);
  @Input("threadId") threadId?: string;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages$: Observable<ConversationPart[]> = EMPTY
  connected$: Observable<boolean> = EMPTY;
  private autoScrollEnabled = true;
  private scrollEventSubscription!: Subscription;
  private clickEventSubscription?: Subscription;

  ngOnInit(): void {

    if(this.threadId){
      this.store.dispatch(connectToChat({threadId: this.threadId}));
    }
    this.store.select(selectCurrentThreadId()).subscribe((threadId) => {
      if (!threadId) {
        return;
      }
      this.threadId = threadId;
      //this.store.dispatch(connectToProject({projectId: this.projectId}));
      this.messages$ = this.store.select(selectCurrentMessages);
      this.connected$ = this.store.select(selectConnected);
      this.cdr.detectChanges();
    });
    this.clickEventSubscription = this.clickEventService.clickSettingEvent$.subscribe(() => {
      this.openChatSettingsDialog();
      this.cdr.detectChanges();
    });

  }

  ngAfterViewInit() {
    this.messages$.subscribe(() => this.scrollToBottom());
    this.scrollEventSubscription = this.monitorScrollEvents();
  }

  ngOnDestroy(): void {
    if (!this.threadId) {
      throw new Error("projectId is required");
    }
    this.store.dispatch(disconnect());
    if (this.scrollEventSubscription) {
      this.scrollEventSubscription.unsubscribe();
    }
    if (this.clickEventSubscription) {
      this.clickEventSubscription.unsubscribe();
    }
  }

  private monitorScrollEvents(): Subscription {
    if(!this.messagesContainer) {
      console.error('messagesContainer is not defined');
      return new Subscription();
    }
    const container = this.messagesContainer.nativeElement;

    return new Observable<void>((observer) => {
      const onScroll = () => {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1; // Add a small threshold
        this.autoScrollEnabled = isAtBottom;
      };
      container.addEventListener('scroll', onScroll);

      return () => container.removeEventListener('scroll', onScroll);
    }).subscribe();
  }

  private scrollToBottom(): void {
    if (!this.autoScrollEnabled || !this.messagesContainer) {
      return;
    }
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }

  private openChatSettingsDialog(): void {
    if (!this.threadId) {
      return;
    }
    this.dialog.open(PaperChatSettingDialogComponent, {
      data: {
        threadId: this.threadId
      }
    });
  }

}
