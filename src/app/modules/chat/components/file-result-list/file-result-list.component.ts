import {Component, input, signal, OnInit} from '@angular/core';
import {ToolFileResponseDTO} from '../../dto/message';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FileResultDetailComponent} from '../file-result-detail/file-result-detail.component';

@Component({
  selector: 'app-file-result-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FileResultDetailComponent,
  ],
  templateUrl: './file-result-list.component.html',
  styleUrl: './file-result-list.component.scss'
})
export class FileResultListComponent implements OnInit {
  files = input.required<ToolFileResponseDTO[]>();

  selectedFile = signal<ToolFileResponseDTO | undefined>(undefined);

  ngOnInit(): void {
    if (this.files().length > 0) {
      this.selectedFile.set(this.files()[0]);
    }
  }
}
