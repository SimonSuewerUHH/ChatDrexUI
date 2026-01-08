import {Component, inject, OnInit, signal} from '@angular/core';
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
import {
  LlmModelSettingDialogComponent
} from './utils/components/llm-model-setting-dialog/llm-model-setting-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {NedrexService} from './modules/chat/service/nedrex.service';

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
    DarkModeToggleComponent,
    MatTooltip,
    MatIconButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly nedrexService: NedrexService = new NedrexService();
  title = 'ChatDrex';
  private isConnected = signal<boolean>(false);
  nedrexEmbeddingsAreAvailable = signal<boolean>(true);

  ngOnInit() {
    // Listen to route changes to manage WebSocket connections
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isChatRoute = event.url.startsWith('/chat');

        if (isChatRoute && !this.isConnected()) {
          // Connect to WebSocket when entering chat routes
          console.log('Entering chat route, connecting to WebSocket...');
          this.store.dispatch(connectToWebsocket());
          this.isConnected.set(true);
        } else if (!isChatRoute && this.isConnected()) {
          // Disconnect from WebSocket when leaving chat routes
          console.log('Leaving chat route, disconnecting from WebSocket...');
          this.store.dispatch(disconnect());
          this.isConnected.set(false);
        }
      });

    this.nedrexService.embeddingsAvailable().subscribe(a => {
      this.nedrexEmbeddingsAreAvailable.set(a);
    });
    // Check initial route
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/chat')) {
      this.store.dispatch(connectToWebsocket());
      this.isConnected.set(true);
    }
  }

  openSettings() {
    this.dialog.open(LlmModelSettingDialogComponent, {
      autoFocus: false,
      height: '600px',
      width: '600px',
      maxWidth: '100vw'
    });
  }
}
