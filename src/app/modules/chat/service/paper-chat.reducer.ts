import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {ChatMessageType, MessageDTO} from '../dto/message';
import {MessageState, RequestDTO} from '../dto/paper-chat';

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

    on(PaperChatActions.receiveAPIMessage, (state, {message}) => {
      const foundMessage: MessageDTO = cloneDeep(message);
      const messagedByThread = cloneDeep(state.messagedByThread);
      const existingMessages = messagedByThread[state.currentThreadId] ?? [];
      const messageText = (foundMessage.message as string).toUpperCase();
      const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);

      if (messageIndex === -1) {
        return state;
      }
      if (messageText === 'STOP') {
        messagedByThread[state.currentThreadId][messageIndex].state = MessageState.END;
      }
      return {
        ...state,
        messagedByThread: messagedByThread,
      };
    }),
    on(PaperChatActions.receiveMessage, (state, {message}) => {
      debugger;
      const foundMessage: MessageDTO = cloneDeep(message);
      const messagedByThread = cloneDeep(state.messagedByThread);
      const existingMessages = messagedByThread[state.currentThreadId] ?? [];

      if (typeof foundMessage.message !== 'string') {
        foundMessage.state = MessageState.START;
        existingMessages.push(foundMessage);
      } else {

        const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);
        if (messageIndex === -1) {
          foundMessage.state = MessageState.START;
          existingMessages.push(foundMessage);
        } else {
          const currentMessage = existingMessages[messageIndex].message ?? "";
          existingMessages[messageIndex] = {
            ...foundMessage,
            message: currentMessage + (foundMessage.message as string),
          };

        }

        messagedByThread[state.currentThreadId] = existingMessages;
      }
      return {
        ...state,
        messagedByThread: messagedByThread,
      };
    }),
    on(PaperChatActions.requestedMessage, (state, {requestedMessage}) => {
      debugger;
      const foundMessage: RequestDTO = cloneDeep(requestedMessage);
      return {
        ...state,
        messagedByThread: {
          ...state.messagedByThread,
          [state.currentThreadId]: [
            ...(state.messagedByThread[state.currentThreadId] ?? []),
            {
              ...foundMessage,
              messageId: uuidv4(),
              messageType: ChatMessageType.HUMAN,
              state: MessageState.END,
              threadId: state.currentThreadId,
            }
          ]
        }
      }

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
    })),
  )
;
