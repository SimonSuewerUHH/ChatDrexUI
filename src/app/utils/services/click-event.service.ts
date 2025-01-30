import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClickEventService {
  private clickSettingEventSubject = new Subject<boolean>();
  private clickSideNavEventSubject = new Subject<boolean>();
  private subscriptionCountSubject = new BehaviorSubject<number>(0);

  private subscriptionCount = 0;

  clickSettingEvent$ = this.clickSettingEventSubject.asObservable();
  clickSideNavEvent$ = this.clickSideNavEventSubject.asObservable();

  get hasSubscribers$(): Observable<boolean> {
    return this.subscriptionCountSubject.asObservable().pipe(
      map((count) => count > 0)
    );
  }

  emitClickSettingEvent() {
    this.clickSettingEventSubject.next(true);
  }

  emitClickSideNavEvent() {
    this.clickSideNavEventSubject.next(true);
  }

  trackSubscription(subscription: Subscription) {
    this.subscriptionCountSubject.next(this.subscriptionCountSubject.value + 1);

    subscription.add(() => {
      this.subscriptionCountSubject.next(this.subscriptionCountSubject.value - 1);
    });
  }

  hasSideNavSubscribers(): boolean {
    return this.subscriptionCount > 0;
  }
}
