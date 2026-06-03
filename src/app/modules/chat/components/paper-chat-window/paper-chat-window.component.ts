import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {Store} from '@ngrx/store';
import {connectToChat} from '../../service/paper-chat.actions';
import {PaperChatSendingBubbleComponent} from '../paper-chat-sending-bubble/paper-chat-sending-bubble.component';
import {PaperChatReceivingBubbleComponent} from '../paper-chat-receiving-bubble/paper-chat-receiving-bubble.component';
import {PaperChatSendComponent} from '../paper-chat-send/paper-chat-send.component';
import {map} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PaperChatSettingDialogComponent} from '../paper-chat-setting-dialog/paper-chat-setting-dialog.component';
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {ActivatedRoute} from '@angular/router';
import {
  selectConnected,
  selectCurrentMessages,
  selectCurrentThreadId,
} from '../../service/paper-chat.selector';

@Component({
  selector: 'app-paper-chat-window',
  imports: [
    PaperChatSendingBubbleComponent,
    PaperChatReceivingBubbleComponent,
    PaperChatSendComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './paper-chat-window.component.html',
  styleUrl: './paper-chat-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatWindowComponent implements OnInit, AfterViewInit {
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly clickEventService: ClickEventService = inject(ClickEventService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('bottomSentinel') private bottomSentinel?: ElementRef<HTMLElement>;

  readonly messages = this.store.selectSignal(selectCurrentMessages);
  readonly connected = this.store.selectSignal(selectConnected);
  readonly threadId = this.store.selectSignal(selectCurrentThreadId());

  readonly atBottom = signal(true);
  readonly unreadCount = signal(0);
  readonly showScrollPill = computed(() => !this.atBottom() && this.unreadCount() > 0);

  private lastMessageSignature = '';
  private viewReady = signal(false);
  private bottomObserver?: IntersectionObserver;

  constructor() {
    effect(() => {
      if (!this.viewReady()) {
        return;
      }
      const msgs = this.messages();
      const signature = this.signatureFor(msgs);
      if (signature === this.lastMessageSignature) {
        return;
      }
      const grew = msgs.length > this.previousMessageCount();
      this.lastMessageSignature = signature;

      queueMicrotask(() => {
        if (this.atBottom()) {
          this.scrollToBottom('auto');
        } else if (grew) {
          this.unreadCount.update(c => c + 1);
        }
      });
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => params['threadId'] as string | undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(threadId => {
        if (threadId) {
          this.store.dispatch(connectToChat({threadId}));
        }
      });

    this.clickEventService.clickSettingEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.openChatSettingsDialog());
  }

  ngAfterViewInit(): void {
    const sentinel = this.bottomSentinel?.nativeElement;
    if (!sentinel) {
      return;
    }

    // IntersectionObserver needs the actual scroll container as its `root`.
    // Without it, observer uses the document viewport — wrong when an ancestor
    // (mat-drawer-content) has its own overflow.
    const root = this.findScrollAncestor(sentinel);
    this.bottomObserver = new IntersectionObserver(
      entries => {
        const atBottom = entries[0]?.isIntersecting === true;
        this.atBottom.set(atBottom);
        if (atBottom) {
          this.unreadCount.set(0);
        }
      },
      {root, rootMargin: '0px 0px 120px 0px', threshold: 0},
    );
    this.bottomObserver.observe(sentinel);
    this.destroyRef.onDestroy(() => this.bottomObserver?.disconnect());

    this.viewReady.set(true);
  }

  scrollToLatest(): void {
    this.scrollToBottom('smooth');
    this.atBottom.set(true);
    this.unreadCount.set(0);
  }

  private previousMessageCount(): number {
    if (!this.lastMessageSignature) {
      return 0;
    }
    const colon = this.lastMessageSignature.indexOf(':');
    return Number(colon < 0 ? this.lastMessageSignature : this.lastMessageSignature.slice(0, colon)) || 0;
  }

  private scrollToBottom(behavior: ScrollBehavior): void {
    const sentinel = this.bottomSentinel?.nativeElement;
    if (!sentinel) {
      return;
    }
    sentinel.scrollIntoView({behavior, block: 'end'});
  }

  private findScrollAncestor(el: HTMLElement): HTMLElement | null {
    let node: HTMLElement | null = el.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      if (/(auto|scroll|overlay)/.test(style.overflowY)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  private signatureFor(msgs: ReturnType<typeof this.messages>): string {
    if (msgs.length === 0) {
      return '0';
    }
    const last = msgs[msgs.length - 1];
    return `${msgs.length}:${last.messageId}:${typeof last.message === 'string' ? last.message.length : 0}`;
  }

  private openChatSettingsDialog(): void {
    const id = this.threadId();
    if (!id) {
      return;
    }
    this.dialog.open(PaperChatSettingDialogComponent, {data: {threadId: id}});
  }
}
