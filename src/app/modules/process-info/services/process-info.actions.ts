import {createAction, props} from '@ngrx/store';
import {ProcessInfoDTO} from '../dto/process-info';

export const startProcessInfoSseStream = createAction(
  '[Process Info] Start SSE Stream'
);

export const startLoadingProcessInfoSseStream = createAction(
  '[Process Info] Start showing loading'
);

export const stopLoadingProcessInfoSseStream = createAction(
  '[Process Info] Stop showing loading'
);


export const showLoadingProcessInfoSseStream = createAction(
  '[Process Info] Start showing Infos'
);

export const hideLoadingProcessInfoSseStream = createAction(
  '[Process Info] Stop showing Infos'
);

export const receiveProcessInfoMessage = createAction(
  '[Process Info] Receive SSE Message',
  props<{ message: ProcessInfoDTO }>()
);

export const processInfoStreamError = createAction(
  '[Process Info] SSE Stream Error',
  props<{ error: string }>()
);

export const sseStreamCompleted = createAction(
  '[Process Info] SSE Stream Completed'
);
