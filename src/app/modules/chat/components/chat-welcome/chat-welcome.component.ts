import {Component, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {PaperChatSendComponent} from '../paper-chat-send/paper-chat-send.component';
import {newChat} from '../../service/paper-chat.actions';
import {ToolTip, toolTips} from '../../../../utils/models/tool-tips';
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-chat-welcome',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    PaperChatSendComponent,
    MatListModule
  ],
  templateUrl: './chat-welcome.component.html',
  styleUrl: './chat-welcome.component.scss'
})
export class ChatWelcomeComponent {
  private readonly store: Store = inject(Store);

  tools: ToolTip[] = toolTips;

  selectedTool?: ToolTip;
  startMessage = '';

  onSend(newMessage: string) {
    this.store.dispatch(newChat({message: newMessage}));
  }


  selectTool(tool: ToolTip) {
    this.selectedTool = tool;
    this.startMessage = tool.command;
  }

  selectHint(hint: string) {
    this.startMessage = this.selectedTool!.command + " " + hint;
  }

  unselectTool() {
    this.selectedTool = undefined;
  }
}
