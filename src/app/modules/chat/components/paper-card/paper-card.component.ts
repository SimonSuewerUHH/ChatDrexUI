import {Component, inject, input} from '@angular/core';
import {ToolSourceDTO} from '../../dto/message';
import {MatCardModule} from '@angular/material/card';
import {JsonPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ResearchPaperDialogComponent} from '../research-paper-dialog/research-paper-dialog.component';

@Component({
  selector: 'app-paper-card',
  imports: [MatCardModule, MatIconModule, JsonPipe],
  templateUrl: './paper-card.component.html',
  styleUrl: './paper-card.component.scss'
})
export class PaperCardComponent {

  private readonly dialog: MatDialog = inject(MatDialog);

  readonly paper = input.required<ToolSourceDTO>();
  readonly showAbstract = input<boolean>();
  readonly showAuthor = input<boolean>();
  readonly allowOpenDialog = input<boolean>(true);


  openDialog(): void {
    if (this.allowOpenDialog()) {
      this.dialog.open(ResearchPaperDialogComponent, {
        data: this.paper(),
        width: '80vw',
        maxWidth: '100vw'
      });
    }
  }
}
