import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {MessageDTO} from '../dto/message';

export interface PaperChatState {
  currentThreadId: string;
  clientId: string;
  threadIds: string[];
  headlineByThread: { [threadId: string]: string };
  messagedByThread: { [threadId: string]: MessageDTO[] };
  connected: boolean;
  error: any
}

export const initialState: PaperChatState = {
  threadIds: [],
  clientId: uuidv4(),
  currentThreadId: uuidv4(),
  messagedByThread: {},
  connected: false,
  error: null,
  headlineByThread: {},
};

export const paperChatReducer = createReducer(
  initialState,
  // Connection Handling
  on(PaperChatActions.connectSuccess, (state, {}) => ({
    ...state,
    connected: true,
    error: null
  })),
  on(PaperChatActions.connectFailure, (state, {error}) => ({
    ...state,
    connected: false,
    error: error
  })),

  // Message Handling
  on(PaperChatActions.receiveMessage, (state, {message}) => {
    const foundMessage: MessageDTO = message;
    const existingMessages = cloneDeep(state.messagedByThread[state.currentThreadId] ?? []);
    if (typeof foundMessage.message === 'string') {
      existingMessages.push(foundMessage);
      return {
        ...state,
        messages: existingMessages,
      };
    }
    const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);

    if (messageIndex === -1) {
      existingMessages.push(foundMessage);
      return {
        ...state,
        messages: existingMessages,
      };
    }
    const currentMessage = existingMessages[messageIndex].message ?? "";
    existingMessages[messageIndex] = {
      ...foundMessage,
      message: currentMessage + (foundMessage.message as string),
    };
    return {
      ...state,
      messages: existingMessages,
    };
  }),

  // Disconnection Handling
  on(PaperChatActions.disconnectSuccess, (state, {}) => ({
    ...state,
    messages: [],
    connected: false
  })),
  on(PaperChatActions.disconnectFailure, (state, {error}) => ({
    ...state,
    errorByClientId: error
  })),
  on(PaperChatActions.setThreadId, (state, {threadId}) => ({
    ...state,
    currentThreadId: threadId ?? uuidv4(),
    threadIds: threadId && !state.threadIds.includes(threadId) ? [...state.threadIds, threadId] : state.threadIds,
  }))
);
