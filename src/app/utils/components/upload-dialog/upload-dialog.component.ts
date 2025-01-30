import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-upload-dialog',
  imports: [MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule],
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.scss'
})
export class UploadDialogComponent {
  private readonly dialogRef: MatDialogRef<UploadDialogComponent> = inject(MatDialogRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @ViewChild('fileInput') fileInput!: ElementRef;

  uploadForm: FormGroup = this.fb.group({
    file: [null],
  });
  uploadedFile?: File;


  onDrop(event: any) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      this.uploadedFile = event.dataTransfer.files[0];
      this.uploadForm.patchValue({file: this.uploadedFile});
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];
      this.uploadForm.patchValue({file: this.uploadedFile});
    }
  }

  onUpload(): void {
    if (this.uploadedFile) {
      this.dialogRef.close(this.uploadedFile)
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
