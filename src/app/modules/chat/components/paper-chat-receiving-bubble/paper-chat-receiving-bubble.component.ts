import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Store} from '@ngrx/store';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgOptimizedImage} from '@angular/common';
import {
  ConversationPart,
  ToolFileResponseDTO,
  ToolSourceDTO,
  ToolStructuredContentType
} from '../../dto/message';
import {ToolsPanelComponent} from '../tools-panel/tools-panel.component';
import {MessageState, Tools} from '../../dto/enums';
import {CustomMarkdownComponent} from '../markdown/markdown.component';
import {DrugstOneNetworkComponent} from '../drugst-one-network/drugst-one-network.component';
import {DrugstOneDTO} from '../../dto/network';
import {environment} from '../../../../../environments/environment';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ErrorListDialogComponent} from '../error-list-dialog/error-list-dialog.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DigestPlotDTO} from '../../dto/digest';
import {DigestPlotComponent} from '../digest-plot/digest-plot.component';
import {FileResultListComponent} from '../file-result-list/file-result-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import {ResearchOverviewComponent} from '../research-overview/research-overview.component';
import {DecisionPanelComponent} from '../decisions-panel/decision-panel.component';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {SanityCheckPanelComponent} from '../sanity-check-panel/sanity-check-panel.component';
import {GuardrailViolationPanelComponent} from '../guardrail-violation-panel/guardrail-violation-panel.component';
import {retryMessage} from '../../service/paper-chat.actions';
import {selectConnected} from '../../service/paper-chat.selector';

@Component({
  selector: 'app-paper-chat-receiving-bubble',
  imports: [
    MatProgressBarModule,
    NgOptimizedImage,
    ToolsPanelComponent,
    CustomMarkdownComponent,
    DrugstOneNetworkComponent,
    MatIcon,
    DigestPlotComponent,
    FileResultListComponent,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    ResearchOverviewComponent,
    DecisionPanelComponent,
    PanelWrapperComponent,
    SanityCheckPanelComponent,
    GuardrailViolationPanelComponent
  ],
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatReceivingBubbleComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly store: Store = inject(Store);
  readonly message = input.required<ConversationPart>();

  private readonly connected = this.store.selectSignal(selectConnected);
  readonly copied = signal(false);

  /** True while we are still receiving streaming output for this bubble. */
  readonly isStreaming = computed(() => this.message().state !== MessageState.END);

  /** Footer (copy / retry) shows once the answer is complete and has content. */
  readonly showFooter = computed(
    () => !this.isStreaming() && this.getMarkdown().length > 0,
  );
  readonly canRetry = computed(() => this.connected() && !this.isStreaming());
  /** Avatar-area loading indicator: still in progress AND we have no body content yet. */
  readonly useLoading = computed(() => {
    if (!this.isStreaming()) {
      return false;
    }
    return (this.message().message?.length ?? 0) === 0;
  });

  /** Inline phase label shown at top of bubble while content is being produced. */
  readonly phaseLabel = computed(() => {
    if (!this.isStreaming()) {
      return '';
    }
    const m = this.message();
    if ((m.message?.length ?? 0) > 0) {
      return 'Writing…';
    }
    const runningTools = m.tools.filter(t => t.started);
    if (runningTools.length > 0) {
      const name = runningTools[runningTools.length - 1].name;
      return name ? `Calling ${name}…` : 'Calling tools…';
    }
    if (m.tools.length > 0) {
      return 'Processing tool result…';
    }
    if (m.decisions.length > 0) {
      return 'Reasoning…';
    }
    return 'Thinking…';
  });

  researchCount = computed(() => {
    return this.message().tools
      .filter(tool => tool.name === Tools.RESEARCH)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.SOURCE)
      .map(tool => tool?.content as ToolSourceDTO)
      .filter(source => !!source)
      .length;
  });

  toolsCount = computed(() => {
    return this.message().tools
      .length;
  });

  getMarkdown(): string {
    return this.message()?.message as string;
  }

  getSource(): ToolSourceDTO[] {
    return this.message().tools
      .filter(tool => tool.name === Tools.RESEARCH && tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.SOURCE)
      .map(tool => tool?.content as ToolSourceDTO)
      .filter(source => !!source)
  }

  openError() {
    this.dialog.open(ErrorListDialogComponent, {
      data: this.message()
    });
  }

  /** Copy the rendered answer (markdown source) to the clipboard. */
  onCopy(): void {
    const text = this.getMarkdown();
    if (!text) {
      return;
    }
    navigator.clipboard?.writeText(text)
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1400);
      })
      .catch(() => {/* clipboard unavailable — no-op */});
  }

  /** Re-ask the user question that produced this answer. */
  onRetry(): void {
    if (!this.canRetry()) {
      return;
    }
    this.store.dispatch(retryMessage({messageId: this.message().messageId}));
  }

  getDrugstOneNetwork(): DrugstOneDTO | undefined {
    const graphs = this.message().tools
      .filter(tool => tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.DRUGST_ONE)
      .map(tool => tool?.content as DrugstOneDTO)
      .filter(network => !!network);
    if (graphs.length > 0) {
      return graphs[0];
    }
    return undefined;
  }

  getDigestPlotData(): DigestPlotDTO | undefined {
    const plots = this.message().tools
      .filter(tool => tool.name === Tools.DIGEST && tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.DIGEST)
      .map(tool => tool?.content as DigestPlotDTO)
      .filter(plot => !!plot);

    if (plots.length > 0) {
      return plots[0];
    }
    return undefined;
  }

  getRemoteFiles(): ToolFileResponseDTO[] | undefined {
    const plots = this.message().tools
      .filter(tool => tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.FILE)
      .map(tool => tool?.content as ToolFileResponseDTO)
      .filter(plot => !!plot);

    if (plots.length > 0) {
      return plots;
    }
    return undefined;
  }


  getRemoteHTML(): string | undefined {
    const urls = this.message().systemMessages
      .filter((m) => {
        return typeof m.message === 'object' && m.message !== null && 'url' in m.message;
      })
      .map((m) => (m.message as any).url)
      .filter(url => !!url)
      .map((url) => {
        return `${environment.apiBaseUrl}/load/${url!.replace(/^generations\//, '')}`;
      });

    if (urls.length > 0) {
      return urls[0];
    }
    return undefined;

  }

  getSanitizedRemoteHTML(): SafeResourceUrl | undefined {
    const url = this.getRemoteHTML();
    if (!url) {
      return undefined
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url!);
  }

  getDecisions(): string[] {
    return this.message().decisions;
  }


}
