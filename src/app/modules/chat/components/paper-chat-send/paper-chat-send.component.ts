import {Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {sendMessage} from '../../service/paper-chat.actions';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-paper-chat-send',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './paper-chat-send.component.html',
  styleUrl: './paper-chat-send.component.scss'
})
export class PaperChatSendComponent {
  readonly threadId = input.required<string>();
  private readonly store: Store = inject(Store);
  message: string = '';

  send(): void {
    if (this.message) {
      this.store.dispatch(
        sendMessage({threadId: this.threadId(), message: this.message})
      );
      this.message = '';
    }
  }
}
