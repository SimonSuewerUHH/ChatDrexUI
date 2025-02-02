import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {ConversationPart, MessageDTO, ToolSourceDTO, ToolSourceInputDTO} from '../dto/message';
import {RequestDTO} from '../dto/paper-chat';
import {ChatMessageType, MessageState, Tools} from '../dto/enums';

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
          isHuman: false,
          sources: []
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

      if (messageIndex === -1 || typeof foundMessage.message !== 'string' || foundMessage.messageType !== ChatMessageType.AI) {
        return state;
      }

      existingMessages[messageIndex].message += foundMessage.message as string;
      messagesByThread[state.currentThreadId] = existingMessages;

      return {
        ...state,
        messagesByThread: messagesByThread,
      };
    }),
    on(PaperChatActions.receiveToolMessage, (state, {message}) => {
      const foundMessage: MessageDTO = cloneDeep(message);
      const messagesByThread = cloneDeep(state.messagesByThread);
      const existingMessages = messagesByThread[state.currentThreadId] ?? [];
      const messageIndex = existingMessages.findIndex(msg => msg.messageId === foundMessage.messageId);

      if (messageIndex === -1 || typeof foundMessage.message !== 'string') {
        return state;
      }

      let toolName = message.message as string;
      const oldTool = existingMessages[messageIndex].tools.at(-1);

      if (toolName.toLowerCase().startsWith("start")) {
        toolName = toolName.replace("START", "");
        existingMessages[messageIndex].tools.push({
          started: true,
          id: uuidv4(),
          input: null,
          name: toolName
        });
      }

      if (oldTool && oldTool.started) {
        if (toolName.toLowerCase().startsWith("stop")) {
          oldTool.started = false;
        } else if (toolName.toLowerCase().startsWith("content")) {
          oldTool.content = toolName.replace("CONTENT", "");
          if (oldTool.name === Tools.SEMANTIC_SCHOLAR) {
            oldTool.content = JSON.parse(oldTool.content) as ToolSourceDTO[];
            existingMessages[messageIndex].sources = [...existingMessages[messageIndex].sources, ...oldTool.content];
          }
          oldTool.started = false;
        } else if (toolName.toLowerCase().startsWith("input")) {
          oldTool.input = toolName.replace("INPUT", "");
          if (oldTool.name === Tools.SEMANTIC_SCHOLAR) {
            oldTool.input = (JSON.parse(oldTool.input) as ToolSourceInputDTO).query;
          }
        }
      }
      messagesByThread[state.currentThreadId] = existingMessages;

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
              sources: [],
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
