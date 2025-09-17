import {Component, inject, OnInit, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent} from '@angular/material/dialog';
import {NedrexService} from '../../service/nedrex.service';
import {NedrexAPIInfoDTO} from '../../dto/nedrex';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-nedrex-info-dialog',
  imports: [
    MatDialogContent,
    DatePipe
  ],
  templateUrl: './nedrex-info-dialog.component.html',
  styleUrl: './nedrex-info-dialog.component.scss'
})
export class NedrexInfoDialogComponent implements OnInit {
  private readonly service: NedrexService = inject(NedrexService)
  readonly id: string = inject<string>(MAT_DIALOG_DATA);

  loading = signal(false);
  error = signal<string | null>(null);
  info = signal<NedrexAPIInfoDTO | null>(null);

  ngOnInit(): void {
    this.fetch();
  }


  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getInfo(this.id)
      .subscribe({
        next: res => {
          this.info.set(res);
          this.loading.set(false);
        },
        error: err => {
          this.error.set(err?.message ?? 'Request failed');
          this.loading.set(false);
        }
      });
  }

}
