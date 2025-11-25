import {Component, input, output} from '@angular/core';
import {MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-closeable-dialog-title',
  imports: [
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './closeable-dialog.component.html',
  styleUrl: './closeable-dialog.component.scss'
})
export class CloseableDialogComponent {
  title = input.required<string>();
  allowMaximize =  input<boolean>(true);
  maximizedChanged = output<boolean>();
  isMaximized = false;

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
    this.maximizedChanged.emit(this.isMaximized);
  }

}
