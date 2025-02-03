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
import {MessageState} from '../../dto/enums';
import {CustomMarkdownComponent} from '../markdown/markdown.component';
import {DrugstOneNetworkComponent} from '../drugst-one-network/drugst-one-network.component';
import {DrugstOneGraph} from '../../dto/network';

@Component({
  selector: 'app-paper-chat-receiving-bubble',
  imports: [MatProgressBarModule, NgOptimizedImage, ToolsPanelComponent, CustomMarkdownComponent, DrugstOneNetworkComponent],
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperChatReceivingBubbleComponent implements OnChanges {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
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

  getDrugstOneNetwork(): DrugstOneGraph | undefined {
    const graphs = this.message().systemMessages
      .filter((m) => {
        return typeof m.message === 'object' && m.message !== null && 'drugstOneNetwork' in m.message;
      })
      .map((m) => (m.message as SystemMessageDTO).drugstOneNetwork)
    if (graphs.length > 0) {
      return graphs[0];
    }
    return undefined;
  }

}
