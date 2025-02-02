import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {
  MatCardModule,

} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {ToolSourceDTO} from '../../dto/message';
import {PaperCardComponent} from '../paper-card/paper-card.component';

@Component({
  selector: 'app-research-paper-dialog',
  imports: [
    MatDialogContent,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    PaperCardComponent,
  ],
  templateUrl: './research-paper-dialog.component.html',
  styleUrl: './research-paper-dialog.component.scss'
})
export class ResearchPaperDialogComponent {
  private readonly dialogRef: MatDialogRef<ResearchPaperDialogComponent> = inject(MatDialogRef);
  readonly data: ToolSourceDTO = inject<ToolSourceDTO>(MAT_DIALOG_DATA);

}
