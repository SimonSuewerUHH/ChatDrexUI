import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgOptimizedImage} from '@angular/common';
import {ShowMessageComponent} from './utils/components/show-message/show-message.component';
import {SidenavBtnComponent} from './utils/components/sidenav-btn/sidenav-btn.component';
import {Store} from '@ngrx/store';
import {connectToWebsocket, disconnect} from './modules/chat/service/paper-chat.actions';
import {NewchatBtnComponent} from './utils/components/newchat-btn/newchat-btn.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DarkModeToggleComponent} from './utils/components/dark-mode-toggle/dark-mode-toggle.component';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    NgOptimizedImage,
    ShowMessageComponent,
    SidenavBtnComponent,
    RouterLink,
    NewchatBtnComponent,
    MatIconModule,
    MatSlideToggleModule,
    DarkModeToggleComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  title = 'ChatDrex';
  private isConnected = false;

  ngOnInit() {
    // Listen to route changes to manage WebSocket connections
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isChatRoute = event.url.startsWith('/chat');

        if (isChatRoute && !this.isConnected) {
          // Connect to WebSocket when entering chat routes
          console.log('Entering chat route, connecting to WebSocket...');
          this.store.dispatch(connectToWebsocket());
          this.isConnected = true;
        } else if (!isChatRoute && this.isConnected) {
          // Disconnect from WebSocket when leaving chat routes
          console.log('Leaving chat route, disconnecting from WebSocket...');
          this.store.dispatch(disconnect());
          this.isConnected = false;
        }
      });

    // Check initial route
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/chat')) {
      this.store.dispatch(connectToWebsocket());
      this.isConnected = true;
    }
  }

}
