import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {ApiErrorSnackbarService} from '../services/api-error-snackbar.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly snackbarService: ApiErrorSnackbarService = inject(ApiErrorSnackbarService);


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((err) => {
        this.snackbarService.showSnackBar(err, "General Error");
        return throwError(() => err);
      }));
  }
}
