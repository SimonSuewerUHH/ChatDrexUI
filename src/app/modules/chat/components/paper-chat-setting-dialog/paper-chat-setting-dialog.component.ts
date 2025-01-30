import {Component, inject, OnInit} from '@angular/core';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from '@ngrx/store';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';


interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-paper-chat-setting-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule],
  templateUrl: './paper-chat-setting-dialog.component.html',
  styleUrl: './paper-chat-setting-dialog.component.scss'
})
export class PaperChatSettingDialogComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: MatDialogRef<PaperChatSettingDialogComponent> = inject(MatDialogRef);


  form: FormGroup = this.fb.group(
    {
      paperFilterSelect: ['', Validators.required]
    }
  );

  ngOnInit() {

  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {

  }

}
