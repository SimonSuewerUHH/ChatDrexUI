import {Component, inject, input} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {Store} from '@ngrx/store';
import {getAllHeadlines} from '../../../chat/service/paper-chat.selector';
import {deleteHistory, deleteThread} from '../../../chat/service/paper-chat.actions';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-introduction-sidenav',
  imports: [
    MatIconModule,
    RouterLink,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    RouterLinkActive,
    AsyncPipe,
    MatMenuModule
  ],
  templateUrl: './introduction-sidenav.component.html',
  styleUrl: './introduction-sidenav.component.scss'
})
export class IntroductionSidenavComponent {
  private readonly store: Store = inject(Store);

  readonly isMobile = input.required<boolean>();
  private readonly clickEventService: ClickEventService = inject(ClickEventService);

  readonly headlines$ = this.store.select(getAllHeadlines);

  onNavigate() {
    if (this.isMobile()) {
      this.clickEventService.emitClickSideNavEvent();
    }
  }

  fireDeleteHistory() {
    this.store.dispatch(deleteHistory());
  }

  fireDeleteThread(threadId: string) {
    this.store.dispatch(deleteThread({threadId}));
  }

  protected readonly Object = Object;
}
