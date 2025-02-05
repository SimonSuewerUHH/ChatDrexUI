import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {ConversationPart} from '../../dto/message';
import { MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-error-list-dialog',
  imports: [
    MatDialogContent,
    MatListModule
  ],
  templateUrl: './error-list-dialog.component.html',
  styleUrl: './error-list-dialog.component.scss'
})
export class ErrorListDialogComponent {
  private readonly dialogRef: MatDialogRef<ErrorListDialogComponent> = inject(MatDialogRef);
  readonly data: ConversationPart = inject<ConversationPart>(MAT_DIALOG_DATA);

}
