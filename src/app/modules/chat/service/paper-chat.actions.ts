import { createAction, props } from '@ngrx/store';
import { MessageDTO } from '../dto/message';


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

export const receiveMessage = createAction(
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
