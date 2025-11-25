import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  IntroductionSidenavComponent
} from "../../../base/components/introduction-sidenav/introduction-sidenav.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-chat-wrapper',
  imports: [
    MatSidenavModule, RouterOutlet, NgClass,
    IntroductionSidenavComponent
  ],
  templateUrl: './chat-wrapper.component.html',
  styleUrl: './chat-wrapper.component.scss'
})
export class ChatWrapperComponent implements OnInit, OnDestroy {
  private readonly clickEventService: ClickEventService = inject(ClickEventService);
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  isSmallScreen = false;
  isOpen = true;
  private clickEventSubscription?: Subscription;

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
        this.isOpen = !this.isSmallScreen;
      });

    this.clickEventSubscription = this.clickEventService.clickSideNavEvent$.subscribe(() => {
      this.isOpen = !this.isOpen;
    });

    this.clickEventService.trackSubscription(this.clickEventSubscription);
  }

  ngOnDestroy(): void {
    if (this.clickEventSubscription) {
      this.clickEventSubscription.unsubscribe();
    }
  }
}
