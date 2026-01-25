import {Component, inject} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-disclaimer-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatIcon
  ],
  templateUrl: './disclaimer-dialog.component.html',
  styleUrl: './disclaimer-dialog.component.scss',
})
export class DisclaimerDialogComponent {
  private readonly ref: MatDialogRef<DisclaimerDialogComponent> = inject(MatDialogRef);

  close(accepted: boolean): void {
    this.ref.close(accepted);
  }
}
