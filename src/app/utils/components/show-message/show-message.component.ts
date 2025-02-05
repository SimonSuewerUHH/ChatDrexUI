import {Component, EffectRef, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';
import {selectConnected, selectCurrentError} from '../../../modules/chat/service/paper-chat.selector';

@Component({
  selector: 'app-show-message',
  imports: [
    MatProgressSpinner,
    MatIconModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './show-message.component.html',
  styleUrl: './show-message.component.scss'
})
export class ShowMessageComponent implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

  public isConnected$!: Observable<boolean>;
  public error$!: Observable<string | null>;

  connectSSERef: EffectRef | undefined;

  ngOnInit(): void {
    this.isConnected$ = this.store.select(selectConnected);
    this.error$ = this.store.select(selectCurrentError);
  }

  ngOnDestroy() {
    if (this.connectSSERef) {
      this.connectSSERef.destroy();
    }
  }
}
