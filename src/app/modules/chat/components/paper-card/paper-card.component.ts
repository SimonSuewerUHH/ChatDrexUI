import {Component, input} from '@angular/core';
import {ToolSourceDTO} from '../../dto/message';
import {MatCardModule} from '@angular/material/card';
import {JsonPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-paper-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './paper-card.component.html',
  styleUrl: './paper-card.component.scss'
})
export class PaperCardComponent {

  readonly paper = input.required<ToolSourceDTO>();
  readonly showAbstract = input<boolean>();
  readonly showAuthor = input<boolean>();

}
