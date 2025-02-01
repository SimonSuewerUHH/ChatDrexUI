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
import {MarkdownComponent, provideMarkdown} from 'ngx-markdown';
import {ConversationPart} from '../../dto/message';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {ToolsPanelComponent} from '../tools-panel/tools-panel.component';
import {MessageState} from '../../dto/enums';

@Component({
  selector: 'app-paper-chat-receiving-bubble',
  imports: [MatProgressBarModule, NgOptimizedImage, MarkdownComponent, ToolsPanelComponent], //
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideMarkdown(),
  ],
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

}
