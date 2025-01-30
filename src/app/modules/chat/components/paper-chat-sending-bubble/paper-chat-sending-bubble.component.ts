import {Component, input} from '@angular/core';
import {MessageDTO} from '../../dto/message';

@Component({
  selector: 'app-paper-chat-sending-bubble',
  imports: [],
  templateUrl: './paper-chat-sending-bubble.component.html',
  styleUrl: './paper-chat-sending-bubble.component.scss'
})
export class PaperChatSendingBubbleComponent {
  readonly message = input<MessageDTO>();

}
