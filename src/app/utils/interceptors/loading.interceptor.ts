import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { finalize } from 'rxjs';
import {SpinnerService} from '../services/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly spinnerService: SpinnerService = inject(SpinnerService);


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.spinnerService.set(true);

    return next.handle(request).pipe(
        finalize(() => {
          this.spinnerService.set(false);
        })
    );
  }
}
