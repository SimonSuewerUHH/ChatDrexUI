import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {ConversationPart, MessageDTO, ToolDTO, ToolSourceDTO, ToolSourceInputDTO} from '../dto/message';
import {ChatMessageType, MessageState, Tools} from '../dto/enums';

export interface PaperChatState {
  currentThreadId: string;
  clientId: string;
  threadIds: string[];
  headlineByThread: { [threadId: string]: string };
  messageOrderByThread: { [threadId: string]: string[] };
  messages: {
    [messageId: string]: ConversationPart
  };
  connected: boolean;
  error: any
}

export const initialState: PaperChatState = {
  threadIds: [],
  clientId: uuidv4(),
  currentThreadId: uuidv4(),
  messageOrderByThread: {},
  messages: {},
  connected: false,
  error: null,
  headlineByThread: {},
};

export const paperChatReducer = createReducer(
  initialState,
  on(PaperChatActions.deleteHistory, (state, {}) => ({
    ...initialState
  })),
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
    const messageText = (message.message as string).toUpperCase();
    if (messageText === 'START') {
      return {
        ...state,
        messageOrderByThread: {
          ...state.messageOrderByThread,
          [state.currentThreadId]: [...(state.messageOrderByThread[state.currentThreadId] ?? []), message.messageId]
        },
        messages: {
          ...state.messages,
          [message.messageId]: {
            message: "",
            timestamp: message.timestamp,
            messageId: message.messageId,
            threadId: message.threadId,
            state: MessageState.START,
            tools: [],
            errors: [],
            decisions: [],
            isHuman: false,
            sources: [],
            systemMessages: []
          }
        },
      }
    }

    if (!(message.messageId in state.messages)) {
      return state;
    }

    if (messageText === 'STOP') {
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.messageId]: {
            ...state.messages[message.messageId],
            state: MessageState.END
          }
        },
      };
    }
    return state
  }),
  on(PaperChatActions.receiveAIMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || typeof message.message !== 'string' || message.messageType !== ChatMessageType.AI) {
      return state;
    }
    const msg = state.messages[message.messageId].message + message.message;
    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          message: msg
        }
      },
    };
  }),
  on(PaperChatActions.receiveSystemMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || typeof message.message == 'string' || message.messageType !== ChatMessageType.SYSTEM) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          systemMessages: [...state.messages[message.messageId].systemMessages, message]
        }
      },
    };
  }),
  on(PaperChatActions.receiveErrorMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || typeof message.message !== 'string' || message.messageType !== ChatMessageType.ERROR) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          errors: [...state.messages[message.messageId].errors, message.message]
        }
      },
    };
  }),
  on(PaperChatActions.receiveToolMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || typeof message.message !== 'string' || message.messageType !== ChatMessageType.AI_TOOL) {
      return state;
    }

    let toolName = message.message as string;

    let oldTool = cloneDeep(state.messages[message.messageId].tools.at(-1));

    if (toolName.toLowerCase().startsWith("start")) {
      toolName = toolName.replace("START", "");
      oldTool = {
        started: true,
        id: uuidv4(),
        input: null,
        name: toolName,
      };
    }

    let sources = state.messages[message.messageId].sources;
    if (oldTool && oldTool.started) {
      if (toolName.toLowerCase().startsWith("stop")) {
        oldTool.started = false;
      } else if (toolName.toLowerCase().startsWith("content")) {
        oldTool.content = toolName.replace("CONTENT", "");
        if (oldTool.name === Tools.SEMANTIC_SCHOLAR) {
          oldTool.content = JSON.parse(oldTool.content) as ToolSourceDTO[];
          sources = [...sources, ...oldTool.content];
        }
        oldTool.started = false;
      } else if (toolName.toLowerCase().startsWith("input")) {
        oldTool.input = toolName.replace("INPUT", "");
        if (oldTool.name === Tools.SEMANTIC_SCHOLAR) {
          oldTool.input = (JSON.parse(oldTool.input) as ToolSourceInputDTO).query;
        }
      }
    }
    const currentTool = state.messages[message.messageId].tools.length > 0 ? state.messages[message.messageId].tools.slice(0, -1) : [];
    const tools: ToolDTO[] = [...currentTool, oldTool!];
    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          tools: tools,
          sources: sources
        }
      },
    };
  }),
  on(PaperChatActions.receiveReasoningMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || typeof message.message !== 'string' || message.messageType !== ChatMessageType.REASONING) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          decisions: [...state.messages[message.messageId].decisions, message.message as string]
        }
      },
    };
  }),
  on(PaperChatActions.requestedMessage, (state, {requestedMessage}) => {

    const messageId = uuidv4();
    let headlineByThread = state.headlineByThread;
    if (state.messageOrderByThread[state.currentThreadId] === undefined) {
      headlineByThread = {
        ...headlineByThread,
        [state.currentThreadId]: requestedMessage.message
      };
    }
    return {
      ...state,
      headlineByThread: headlineByThread,
      messageOrderByThread: {
        ...state.messageOrderByThread,
        [state.currentThreadId]: [...(state.messageOrderByThread[state.currentThreadId] ?? []), messageId]
      },
      messages: {
        ...state.messages,
        [messageId]: {
          ...requestedMessage,
          state: MessageState.END,
          tools: [],
          errors: [],
          decisions: [],
          sources: [],
          systemMessages: [],
          isHuman: true,
          messageId: uuidv4(),
          threadId: state.currentThreadId,
        }
      },
    };
  }),
// Disconnection Handling
  on(PaperChatActions.disconnectSuccess, (state, {}) => ({
    ...state,
    connected: false,
    error: null
  })),
  on(PaperChatActions.disconnectFailure, (state, {error}) => ({
    ...state,
    errorByClientId: error
  })),
  on(PaperChatActions.connectToChatSuccess, (state, {threadId}) => ({
    ...state,
    currentThreadId: threadId,
    threadIds: !state.threadIds.includes(threadId) ? [...state.threadIds, threadId] : state.threadIds,
  })),
);
