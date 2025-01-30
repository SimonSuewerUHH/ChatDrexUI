import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, takeUntil} from 'rxjs/operators';
import * as ProcessInfoActions from './process-info.actions';
import {ProcessInfoService} from './process-info.service';

@Injectable()
export class ProcessInfoEffects {

  private readonly service: ProcessInfoService = inject(ProcessInfoService);
  private readonly actions$: Actions = inject(Actions);

  startSseStream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessInfoActions.startProcessInfoSseStream),
      mergeMap(() =>
        this.service.processInfoStreamStream().pipe(
          map((message) => ProcessInfoActions.receiveProcessInfoMessage({ message })),
          catchError((error) => of(ProcessInfoActions.processInfoStreamError({ error }))),
          takeUntil(this.actions$.pipe(ofType(ProcessInfoActions.sseStreamCompleted))) // Stop Stream on Completion
        )
      )
    )
  );
}
