import {Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {sendMessage} from '../../service/paper-chat.actions';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';

interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-paper-chat-send',
  imports: [
    MatAutocompleteModule,
    MatOptionModule,
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

  options: Option[] = [
    {label: 'Ask about possibilietes', value: '/chat'},
    {label: 'Ask current Research question', value: '/research'},
    {label: 'Use the Diamond alogrithm', value: '/diamond'},
    {label: 'Use the Digest Sub alogrithm', value: '/digest_sub'},
    {label: 'Use the Digest Set alogrithm', value: '/digest_set'},
    {label: 'Use the Trustrank alogrithm', value: '/trustrank'},
    {label: 'Ask directly the Nextdrex BD', value: '/netdrex'},
  ];
  filteredOptions: Option[] = [];
  selectedCommand?: string;

  onKeyUp(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    if (input.startsWith('/')) {
      this.filteredOptions = this.options.filter(option =>
        option.value.startsWith(input)
      );
    } else {
      this.filteredOptions = [];
    }
  }

  displayOption(option: any): string {
    return option?.value || '';
  }

  send(): void {
    if (this.message) {
      this.store.dispatch(
        sendMessage({threadId: this.threadId(), message: this.message})
      );
      this.message = '';
    }
  }
}
