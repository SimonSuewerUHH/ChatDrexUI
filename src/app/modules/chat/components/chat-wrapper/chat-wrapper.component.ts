import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {
    IntroductionSidenavComponent
} from "../../../base/components/introduction-sidenav/introduction-sidenav.component";
import {MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenavModule} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";
import {Store} from '@ngrx/store';
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
  private readonly store: Store = inject(Store);
  private readonly clickEventService: ClickEventService = inject(ClickEventService);
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  @Input("projectId") projectId?: number;

  isSmallScreen = false;
  isOpen = true;
  private clickEventSubscription?: Subscription;

  ngOnInit(): void {
    if (this.projectId) {
      //this.store.dispatch(retrieveProject({id: this.projectId}));
    }
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
