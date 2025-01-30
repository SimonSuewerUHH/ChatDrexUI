import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {PaperChatWebsocketState} from '../../dto/paper-chat';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgOptimizedImage} from '@angular/common';
import {MarkdownComponent, provideMarkdown} from 'ngx-markdown';
import {MessageDTO} from '../../dto/message';

@Component({
  selector: 'app-paper-chat-receiving-bubble',
  imports: [MatProgressBarModule, NgOptimizedImage], //MarkdownComponent
  templateUrl: './paper-chat-receiving-bubble.component.html',
  styleUrl: './paper-chat-receiving-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideMarkdown(),
  ],
})
export class PaperChatReceivingBubbleComponent implements OnChanges {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  readonly message = input<MessageDTO>();

  useLoading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["message"]) {
      if (changes["message"].currentValue.state === PaperChatWebsocketState.START) {
        this.useLoading = true;
      }
      if (changes["message"].currentValue.state === PaperChatWebsocketState.END) {
        this.useLoading = false;
      }
      this.cdr.detectChanges();
    }
  }

}
