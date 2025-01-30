import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, Router, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideState, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LoadingInterceptor} from './utils/interceptors/loading.interceptor';
import {ErrorInterceptor} from './utils/interceptors/error.interceptor';
import {ProcessInfoEffects} from './modules/process-info/services/process-info.effects';
import {processInfoReducer} from './modules/process-info/services/process-info.reducer';
import {PaperChatEffects} from './modules/chat/service/paper-chat.effects';
import {paperChatReducer} from './modules/chat/service/paper-chat.reducer';
import {GlobalErrorHandler} from './utils/interceptors/error.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideStore(),
    provideState(
      {name: 'processInfo', reducer: processInfoReducer}
    ),
    provideState(
      {name: 'paperChat', reducer: paperChatReducer}
    ),
    provideEffects([
      ProcessInfoEffects,
      PaperChatEffects
    ]),
  ]
};
