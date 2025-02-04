import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgOptimizedImage} from '@angular/common';
import {ShowMessageComponent} from './modules/process-info/components/show-message/show-message.component';
import {SidenavBtnComponent} from './utils/components/sidenav-btn/sidenav-btn.component';
import {Store} from '@ngrx/store';
import {connectToWebsocket} from './modules/chat/service/paper-chat.actions';
import {NewchatBtnComponent} from './utils/components/newchat-btn/newchat-btn.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, NgOptimizedImage, ShowMessageComponent, SidenavBtnComponent, RouterLink, NewchatBtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly store: Store = inject(Store);
  title = 'Academate';

  ngOnInit() {
    this.store.dispatch(connectToWebsocket());
  }
}
