import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent} from '@angular/material/dialog';
import {ToolSourceDTO} from '../../dto/message';
import {PaperCardComponent} from '../paper-card/paper-card.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-research-paper-dialog',
  imports: [
    MatDialogContent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon
  ],
  templateUrl: './research-paper-dialog.component.html',
  styleUrl: './research-paper-dialog.component.scss'
})
export class ResearchPaperDialogComponent {
  readonly data: ToolSourceDTO = inject<ToolSourceDTO>(MAT_DIALOG_DATA);

}
