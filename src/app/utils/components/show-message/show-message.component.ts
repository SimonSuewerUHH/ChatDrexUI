import {Component, EffectRef, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, map, combineLatest} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {selectConnected, selectCurrentError} from '../../../modules/chat/service/paper-chat.selector';

@Component({
  selector: 'app-show-message',
  imports: [
    MatIconModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './show-message.component.html',
  styleUrl: './show-message.component.scss'
})
export class ShowMessageComponent implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);

  public isConnected$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  public showConnectionBanner$!: Observable<boolean>;

  connectSSERef: EffectRef | undefined;

  ngOnInit(): void {
    this.isConnected$ = this.store.select(selectConnected);
    this.error$ = this.store.select(selectCurrentError);
    
    // Only show connection banner when on chat routes
    const currentRoute$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.startsWith('/chat')),
      // Start with current route
    );
    
    // Check initial route
    const isOnChatRoute$ = new Observable<boolean>(subscriber => {
      subscriber.next(this.router.url.startsWith('/chat'));
      const subscription = currentRoute$.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
    
    // Show banner only when on chat route AND not connected
    this.showConnectionBanner$ = combineLatest([
      this.isConnected$,
      isOnChatRoute$
    ]).pipe(
      map(([isConnected, isOnChatRoute]) => isOnChatRoute && !isConnected)
    );
  }

  ngOnDestroy() {
    if (this.connectSSERef) {
      this.connectSSERef.destroy();
    }
  }
}
