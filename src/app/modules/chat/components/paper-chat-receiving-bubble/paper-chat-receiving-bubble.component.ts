import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgOptimizedImage} from '@angular/common';
import {ConversationPart, SystemMessageDTO, ToolSourceDTO} from '../../dto/message';
import {ToolsPanelComponent} from '../tools-panel/tools-panel.component';
import {MessageState, Tools} from '../../dto/enums';
import {CustomMarkdownComponent} from '../markdown/markdown.component';
import {DrugstOneNetworkComponent} from '../drugst-one-network/drugst-one-network.component';
import {DrugstOneGraph, DrugstOneNetwork} from '../../dto/network';
import {environment} from '../../../../../environments/environment';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ErrorListDialogComponent} from '../error-list-dialog/error-list-dialog.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DigestPlotDTO} from '../../dto/digest';
import {DigestPlotComponent} from '../digest-plot/digest-plot.component';

@Component({
  selector: 'app-paper-chat-receiving-bubble',
  imports: [MatProgressBarModule, NgOptimizedImage, ToolsPanelComponent, CustomMarkdownComponent, DrugstOneNetworkComponent, MatIconButton, MatIcon, DigestPlotComponent],
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatReceivingBubbleComponent implements OnChanges {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  readonly message = input.required<ConversationPart>();
  useLoading: boolean = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes["message"]) {
      if (changes["message"].currentValue.state === MessageState.START) {
        this.useLoading = true;
      }
      if (changes["message"].currentValue.state === MessageState.END) {
        this.useLoading = false;
      }
      this.cdr.detectChanges();
    }
  }

  getMarkdown(): string {
    return this.message()?.message as string;
  }

  getSource(): ToolSourceDTO[] {
    return this.message().sources
  }

  openError() {
    this.dialog.open(ErrorListDialogComponent, {
      data: this.message()
    });
  }

  getDrugstOneNetwork(): DrugstOneGraph | undefined {
    const graphs = this.message().tools
      .filter(tool => tool.name === Tools.NETDREX_TOOL && tool.structuredContent && tool.structuredContent.length > 0)
      .flatMap(tool => tool.structuredContent as DrugstOneNetwork[])
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
      .flatMap(tool => tool.structuredContent as DigestPlotDTO[])
      .filter(plot => !!plot);

    if (plots.length > 0) {
      return plots[0];
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


}
