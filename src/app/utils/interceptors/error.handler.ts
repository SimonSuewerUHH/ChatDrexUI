import {ErrorHandler, inject, Injectable, Injector, NgZone} from '@angular/core';
import {ApiErrorSnackbarService} from '../services/api-error-snackbar.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly ngZone: NgZone = inject(NgZone);
  private readonly injector: Injector = inject(Injector);

  handleError(error: any): void {
    const message = error.message || error.error.message || error.error || error.statusText;
    this.ngZone.run(() => {
      const snackBarService = this.injector.get(ApiErrorSnackbarService);
      snackBarService.showSnackBarOnlyText(error, 'Internal Error: ' + message, true);
    });
  }

}
