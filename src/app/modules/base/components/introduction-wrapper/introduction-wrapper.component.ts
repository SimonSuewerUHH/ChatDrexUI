import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenavModule} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";
import {Store} from '@ngrx/store';
import {ClickEventService} from '../../../../utils/services/click-event.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {IntroductionSidenavComponent} from '../introduction-sidenav/introduction-sidenav.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-introduction-wrapper',
  imports: [
    MatSidenavModule, RouterOutlet, NgClass,
    IntroductionSidenavComponent
  ],
  templateUrl: './introduction-wrapper.component.html',
  styleUrl: './introduction-wrapper.component.scss'
})
export class IntroductionWrapperComponent implements OnInit, OnDestroy {
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
