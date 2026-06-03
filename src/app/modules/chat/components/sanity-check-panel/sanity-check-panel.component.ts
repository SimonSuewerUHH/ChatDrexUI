import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Store} from '@ngrx/store';
import {ConversationPart} from '../../dto/message';
import {
  approveSanityCheck,
  declineSanityCheck,
  disableSanityCheck,
} from '../../service/paper-chat.actions';
import {selectPaperChatFeature} from '../../service/paper-chat.selector';

@Component({
  selector: 'app-sanity-check-panel',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './sanity-check-panel.component.html',
  styleUrl: './sanity-check-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanityCheckPanelComponent {
  private readonly store: Store = inject(Store);

  readonly message = input.required<ConversationPart>();

  private state = this.store.selectSignal(selectPaperChatFeature);

  approval = computed(() => this.message().sanityCheckApproval);
  pending = computed(() => this.message().sanityCheckPending === true);
  resolved = computed(() => this.message().sanityCheckResolved);
  error = computed(() => this.message().sanityCheckError);

  plainEnglishSummary = computed(() => this.approval()?.review.plainEnglishSummary ?? '');
  riskReason = computed(() => this.approval()?.plan.riskReason ?? '');
  canDisable = computed(() => this.approval()?.canDisable === true);
  hasOriginalMessage = computed(() => this.originalUserMessage().length > 0);

  /** Planned steps the agent intends to run (shown so the user can review). */
  planSteps = computed(() => this.approval()?.plan.questionActionPairs ?? []);
  uncertainties = computed(() => this.approval()?.review.uncertainties ?? []);

  /** Whether the editor is open (explicit "change the message" affordance). */
  readonly editing = signal(false);
  /** True once the draft differs from the original request. */
  readonly isEdited = computed(
    () => this.draft().trim().length > 0 && this.draft().trim() !== this.originalUserMessage().trim(),
  );

  originalUserMessage = computed(() => {
    const aiId = this.message().messageId;
    const s = this.state();
    for (const order of Object.values(s.messageOrderByThread)) {
      const idx = order.indexOf(aiId);
      if (idx < 0) {
        continue;
      }
      for (let i = idx - 1; i >= 0; i--) {
        const part = s.messages[order[i]];
        if (part?.isHuman && typeof part.message === 'string' && part.message.length > 0) {
          return part.message;
        }
      }
      return '';
    }
    return '';
  });

  draft = signal<string>('');
  private lastInitialized = '';

  constructor() {
    effect(() => {
      const original = this.originalUserMessage();
      if (!original) {
        return;
      }
      untracked(() => {
        if (original !== this.lastInitialized && !this.resolved()) {
          this.lastInitialized = original;
          this.draft.set(original);
        }
      });
    });
  }

  toggleEdit(): void {
    if (this.pending() || this.resolved()) {
      return;
    }
    this.editing.update(v => !v);
  }

  onApprove(): void {
    if (this.pending() || this.resolved()) {
      return;
    }
    this.store.dispatch(
      approveSanityCheck({
        messageId: this.message().messageId,
        messageText: this.draft(),
      }),
    );
  }

  /** "Not agree": dismiss the proposed workflow without running it. */
  onDecline(): void {
    if (this.pending() || this.resolved()) {
      return;
    }
    this.store.dispatch(declineSanityCheck({messageId: this.message().messageId}));
  }

  onDisable(): void {
    if (this.pending() || this.resolved()) {
      return;
    }
    this.store.dispatch(disableSanityCheck({messageId: this.message().messageId}));
  }
}
