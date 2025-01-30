import {Component, inject, OnInit} from '@angular/core';
import { MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ClickEventService} from '../../services/click-event.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-sidenav-btn',
  imports: [
    MatIconModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './sidenav-btn.component.html',
  styleUrl: './sidenav-btn.component.scss'
})
export class SidenavBtnComponent {
  private readonly clickEventService: ClickEventService = inject(ClickEventService);
  hasSubscribers$ = this.clickEventService.hasSubscribers$;

  onClick() {
    this.clickEventService.emitClickSideNavEvent();
  }


}
