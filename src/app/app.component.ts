import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {ShowMessageComponent} from './utils/components/show-message/show-message.component';
import {SidenavBtnComponent} from './utils/components/sidenav-btn/sidenav-btn.component';
import {Store} from '@ngrx/store';
import {connectToWebsocket} from './modules/chat/service/paper-chat.actions';
import {MatIconModule} from '@angular/material/icon';
import {DarkModeToggleComponent} from './utils/components/dark-mode-toggle/dark-mode-toggle.component';
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
    NgOptimizedImage,
    ShowMessageComponent,
    SidenavBtnComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
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
  private readonly nedrexService: NedrexService = new NedrexService();
  title = 'ChatDrex';
  readonly year = new Date().getFullYear();
  nedrexEmbeddingsAreAvailable = signal<boolean>(true);

  ngOnInit() {
    this.nedrexService.embeddingsAvailable().subscribe(a => {
      this.nedrexEmbeddingsAreAvailable.set(a);
    });
    this.store.dispatch(connectToWebsocket());
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
