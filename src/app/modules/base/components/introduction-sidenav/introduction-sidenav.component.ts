import {Component, inject, input, signal} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Store} from '@ngrx/store';
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {getAllHeadlines} from '../../../chat/service/paper-chat.selector';
import {deleteHistory, deleteThread} from '../../../chat/service/paper-chat.actions';

@Component({
  selector: 'app-introduction-sidenav',
  imports: [
    AsyncPipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './introduction-sidenav.component.html',
  styleUrl: './introduction-sidenav.component.scss',
})
export class IntroductionSidenavComponent {
  private readonly store: Store = inject(Store);
  private readonly clickEventService: ClickEventService = inject(ClickEventService);

  readonly isMobile = input.required<boolean>();
  readonly searchTerm = signal('');
  readonly headlines$ = this.store.select(getAllHeadlines);

  onNavigate(): void {
    if (this.isMobile()) {
      this.clickEventService.emitClickSideNavEvent();
    }
  }

  fireDeleteHistory(): void {
    this.store.dispatch(deleteHistory());
  }

  fireDeleteThread(threadId: string): void {
    this.store.dispatch(deleteThread({threadId}));
  }

  /** Reverse-chronological entries, filtered by a case-insensitive title match. */
  filterHeadlines(
    headlines: Record<string, string>,
    term: string,
  ): Array<[string, string]> {
    const entries = Object.entries(headlines).reverse();
    const t = term.trim().toLowerCase();
    if (!t) {
      return entries;
    }
    return entries.filter(([, title]) => (title ?? '').toLowerCase().includes(t));
  }
}
