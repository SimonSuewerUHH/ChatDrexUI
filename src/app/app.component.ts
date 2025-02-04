import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgOptimizedImage} from '@angular/common';
import {ShowMessageComponent} from './modules/process-info/components/show-message/show-message.component';
import {SidenavBtnComponent} from './utils/components/sidenav-btn/sidenav-btn.component';
import {Store} from '@ngrx/store';
import {connectToWebsocket} from './modules/chat/service/paper-chat.actions';
import {NewchatBtnComponent} from './utils/components/newchat-btn/newchat-btn.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {DarkModeToggleComponent} from './utils/components/dark-mode-toggle/dark-mode-toggle.component';

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
  title = 'ChatDrex';

  ngOnInit() {
    this.store.dispatch(connectToWebsocket());
  }

}
