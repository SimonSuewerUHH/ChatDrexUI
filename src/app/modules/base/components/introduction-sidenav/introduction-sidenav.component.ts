import {Component, inject, input} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatDivider, MatDividerModule} from "@angular/material/divider";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {
  MatListModule
} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ClickEventService} from '../../../../utils/services/click-event.service';

@Component({
  selector: 'app-introduction-sidenav',
  imports: [
    MatIconModule,
    RouterLink,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    RouterLinkActive
  ],
  templateUrl: './introduction-sidenav.component.html',
  styleUrl: './introduction-sidenav.component.scss'
})
export class IntroductionSidenavComponent {
  readonly isMobile = input.required<boolean>();
  private readonly clickEventService: ClickEventService = inject(ClickEventService);

  onNavigate(){
    if(this.isMobile()) {
      this.clickEventService.emitClickSideNavEvent();
    }
  }

}
