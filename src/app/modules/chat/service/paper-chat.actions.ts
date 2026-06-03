import {createAction, props} from '@ngrx/store';
import {MessageDTO} from '../dto/message';
import {RequestDTO} from '../dto/paper-chat';


export const deleteHistory = createAction(
  '[Chat] deleteHistory'
);

export const deleteThread = createAction(
  '[Chat] deleteThread',
  props<{ threadId: string }>()
);


export const newChat = createAction(
  '[Chat] Create new Conversation with setThreadId',
  props<{ threadId?: string, message: string }>()
);

export const connectToChat = createAction(
  '[Chat] Switch to a Conversation with threadId',
  props<{ threadId: string }>()
);


export const connectToChatSuccess = createAction(
  '[Chat] Success Switch to a Conversation with threadId',
  props<{ threadId: string }>()
);
export const connectToChatFailure = createAction(
  '[Chat] Failed switch to a Conversation with threadId'
);

export const connectToWebsocket = createAction(
  '[Chat] Connect to Project'
);

export const reconnectToWebsocket = createAction(
  '[Chat] reconnect to current Project',
);

export const connectSuccess = createAction(
  '[Chat] Connect Success'
);

export const connectFailure = createAction(
  '[Chat] Connect Failure',
  props<{ error: any }>()
);

export const reconnectAttempt = createAction(
  '[Chat] Reconnect Attempt',
  props<{ attempt: number; nextRetryMs: number }>()
);

export const reconnectReset = createAction(
  '[Chat] Reconnect Reset'
);

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ threadId: string; message: string }>()
);

export const retryMessage = createAction(
  '[Chat] Retry Message',
  props<{ messageId: string }>()
);

export const approveSanityCheck = createAction(
  '[Chat] Approve Sanity Check',
  props<{ messageId: string; messageText?: string }>()
);

export const disableSanityCheck = createAction(
  '[Chat] Disable Sanity Check',
  props<{ messageId: string }>()
);

export const declineSanityCheck = createAction(
  '[Chat] Decline Sanity Check',
  props<{ messageId: string }>()
);

export const sanityCheckError = createAction(
  '[Chat] Sanity Check Error',
  props<{ messageId: string; reason: string }>()
);

export const requestedMessage = createAction(
  '[Chat] Sended Message',
  props<{ requestedMessage: RequestDTO }>()
);

export const receiveAIMessage = createAction(
  '[Chat] Receive AI Message',
  props<{ message: MessageDTO }>()
);

export const receiveErrorMessage = createAction(
  '[Chat] Receive Error Message',
  props<{ message: MessageDTO }>()
);


export const receiveSystemMessage = createAction(
  '[Chat] Receive System Message',
  props<{ message: MessageDTO }>()
);

export const receiveToolMessage = createAction(
  '[Chat] Receive Tool Message',
  props<{ message: MessageDTO }>()
);
export const receiveReasoningMessage = createAction(
  '[Chat] Receive Reasoning Message',
  props<{ message: MessageDTO }>()
);


export const receiveAPIMessage = createAction(
  '[Chat] Receive API Message',
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
  props<{ error: any }>()
);
