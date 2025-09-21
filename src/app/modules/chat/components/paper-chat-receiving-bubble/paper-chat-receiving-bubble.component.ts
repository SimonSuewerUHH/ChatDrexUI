import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgOptimizedImage} from '@angular/common';
import {
  ConversationPart,
  SystemMessageDTO,
  ToolFileResponseDTO,
  ToolSourceDTO,
  ToolStructuredContentType
} from '../../dto/message';
import {ToolsPanelComponent} from '../tools-panel/tools-panel.component';
import {MessageState, Tools} from '../../dto/enums';
import {CustomMarkdownComponent} from '../markdown/markdown.component';
import {DrugstOneNetworkComponent} from '../drugst-one-network/drugst-one-network.component';
import {DrugstOneGraph, DrugstOneNetwork} from '../../dto/network';
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
    ResearchOverviewComponent,
    DecisionPanelComponent,
    PanelWrapperComponent
  ],
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatReceivingBubbleComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  readonly message = input.required<ConversationPart>();
  useLoading = computed(() => this.message().state === MessageState.START);

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

  getDrugstOneNetwork(): DrugstOneGraph | undefined {
    const graphs = this.message().tools
      .filter(tool => tool.name === Tools.NETDREX_TOOL && tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent)
      .filter(tool => tool?.type === ToolStructuredContentType.DRUGST_ONE)
      .map(tool => tool?.content as DrugstOneNetwork)
      .filter(network => !!network)
      .map(n => {
        return {
          network: n
        } as DrugstOneGraph
      });

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
      .map((m) => (m.message as SystemMessageDTO).url)
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
