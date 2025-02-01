import { createAction, props } from '@ngrx/store';
import { MessageDTO } from '../dto/message';
import {RequestDTO} from '../dto/paper-chat';


export const setThreadId = createAction(
  '[Chat] Create new Conversation with setThreadId',
  props<{ threadId?: string }>()
);

export const connectToWebsocket = createAction(
  '[Chat] Connect to Project'
);

export const connectSuccess = createAction(
  '[Chat] Connect Success'
);

export const connectFailure = createAction(
  '[Chat] Connect Failure',
  props<{  error: any }>()
);

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ threadId: string; message: string }>()
);

export const requestedMessage = createAction(
  '[Chat] Sended Message',
  props<{  requestedMessage: RequestDTO }>()
);

export const receiveAIMessage = createAction(
  '[Chat] Receive Message',
  props<{ message: MessageDTO }>()
);

export const receiveAPIMessage = createAction(
  '[Chat] Receive Message',
  props<{ message: MessageDTO }>()
);

export const disconnect = createAction(
  '[Chat] Disconnect from Project'
);

export const disconnectSuccess = createAction(
  '[Chat] Disconnect Success'
);

export const disconnectFailure = createAction(
  '[Chat] Disconnect Failure',
  props<{error: any }>()
);
