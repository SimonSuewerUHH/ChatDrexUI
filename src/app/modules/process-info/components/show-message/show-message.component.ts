import {Component, EffectRef, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {
  hideLoadingProcessInfoSseStream,
  startProcessInfoSseStream
} from '../../services/process-info.actions';
import {
  selectIsConnected,
  selectError,
  selectShowLoading,
  selectProcessLastInfo, selectShowMessage
} from '../../services/process-info.selectors';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';
import {selectConnected} from '../../../chat/service/paper-chat.selector';

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
  public showLoading$!: Observable<boolean>;
  public showMessage$!: Observable<boolean>;
  public lastMessage$!: Observable<string | null>;

  connectSSERef: EffectRef | undefined;

  ngOnInit(): void {
    this.connectSSERef = this.store.dispatch(() => startProcessInfoSseStream());
    this.isConnected$ = this.store.select(selectConnected);
    this.error$ = this.store.select(selectError());
    this.showLoading$ = this.store.select(selectShowLoading());
    this.showMessage$ = this.store.select(selectShowMessage());
    this.lastMessage$ = this.store.select(selectProcessLastInfo());
  }

  ngOnDestroy() {
    if (this.connectSSERef) {
      this.connectSSERef.destroy();
    }
  }

  close() {
    this.store.dispatch(() => hideLoadingProcessInfoSseStream());
  }
}
