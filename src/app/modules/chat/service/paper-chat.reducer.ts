import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {ChatMessageType, ConversationPart, MessageDTO} from '../dto/message';
import {MessageState, RequestDTO} from '../dto/paper-chat';
import {receiveAIMessage} from './paper-chat.actions';

export interface PaperChatState {
  currentThreadId: string;
  clientId: string;
  threadIds: string[];
  headlineByThread: { [threadId: string]: string };
  messagesByThread: { [threadId: string]: ConversationPart[] };
  connected: boolean;
  error: any
}

export const initialState: PaperChatState = {
  threadIds: [],
  clientId: uuidv4(),
  currentThreadId: uuidv4(),
  messagesByThread: {},
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
      const messagesByThread = cloneDeep(state.messagesByThread);
      const existingMessages = messagesByThread[state.currentThreadId] ?? [];
      const messageText = (foundMessage.message as string).toUpperCase();
      const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);

      if (messageText === 'START') {
        existingMessages.push({
          message: "",
          timestamp: foundMessage.timestamp,
          messageId: foundMessage.messageId,
          threadId: foundMessage.threadId,
          state: MessageState.START,
          tools: [],
          errors: [],
          decisions: [],
          isHuman: false
        })
        return {
          ...state,
          messagesByThread: {
            ...state.messagesByThread,
            [state.currentThreadId]: existingMessages
          }
        }
      }

      if (messageIndex === -1) {
        return state;
      }
      if (messageText === 'STOP') {
        messagesByThread[state.currentThreadId][messageIndex].state = MessageState.END;
      }
      return {
        ...state,
        messagesByThread: messagesByThread,
      };
    }),
    on(PaperChatActions.receiveAIMessage, (state, {message}) => {
      const foundMessage: MessageDTO = cloneDeep(message);
      const messagesByThread = cloneDeep(state.messagesByThread);
      const existingMessages = messagesByThread[state.currentThreadId] ?? [];
      const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);

      if (messageIndex === -1 || typeof foundMessage.message !== 'string') {
        return state;
      } else {
        existingMessages[messageIndex].message += foundMessage.message as string;
        messagesByThread[state.currentThreadId] = existingMessages;
      }
      return {
        ...state,
        messagesByThread: messagesByThread,
      };
    }),
    on(PaperChatActions.requestedMessage, (state, {requestedMessage}) => {
      const foundMessage: RequestDTO = cloneDeep(requestedMessage);
      return {
        ...state,
        messagesByThread: {
          ...state.messagesByThread,
          [state.currentThreadId]: [
            ...(state.messagesByThread[state.currentThreadId] ?? []),
            {
              ...foundMessage,
              state: MessageState.END,
              tools: [],
              errors: [],
              decisions: [],
              isHuman: true,
              messageId: uuidv4(),
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
