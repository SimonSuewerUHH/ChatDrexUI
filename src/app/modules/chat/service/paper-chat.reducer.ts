import {createReducer, on} from '@ngrx/store';
import * as PaperChatActions from './paper-chat.actions';
import {v4 as uuidv4} from 'uuid';
import {
  ConversationPart,
  GUARDRAIL_VIOLATION_CODE,
  GuardrailViolationDTO,
  PRE_EXECUTION_SANITY_CHECK_APPROVAL_REQUIRED,
  SanityCheckApprovalDTO,
  ToolDTO,
} from '../dto/message';
import {ChatMessageType, MessageState} from '../dto/enums';

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
  error: any;
  reconnectAttempt: number;
  reconnectNextRetryMs: number;
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
  reconnectAttempt: 0,
  reconnectNextRetryMs: 0,
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
    error: null,
    reconnectAttempt: 0,
    reconnectNextRetryMs: 0,
  })),
  on(PaperChatActions.connectFailure, (state, {error}) => ({
    ...state,
    connected: false,
    error: error
  })),
  on(PaperChatActions.reconnectToWebsocket, (state,) => ({
    ...state,
    connected: false,
    error: null
  })),
  on(PaperChatActions.reconnectAttempt, (state, {attempt, nextRetryMs}) => ({
    ...state,
    connected: false,
    reconnectAttempt: attempt,
    reconnectNextRetryMs: nextRetryMs,
  })),
  on(PaperChatActions.reconnectReset, (state) => ({
    ...state,
    reconnectAttempt: 0,
    reconnectNextRetryMs: 0,
  })),

  // Message Handling
  on(PaperChatActions.receiveAPIMessage, (state, {message}) => {
    const messageText = (message.message as string).toUpperCase();
    if (messageText === 'START') {
      // If this START is the answer to a just-resolved sanity check, drop the
      // resolved parent bubble entirely — the new bubble replaces it in the UI.
      const ancestorId = findResolvedSanityCheckAncestor(state, state.currentThreadId);

      const prevOrder = state.messageOrderByThread[state.currentThreadId] ?? [];
      const nextOrder = ancestorId
        ? [...prevOrder.filter(id => id !== ancestorId), message.messageId]
        : [...prevOrder, message.messageId];

      const nextMessages: typeof state.messages = {...state.messages};
      if (ancestorId) {
        delete nextMessages[ancestorId];
      }
      nextMessages[message.messageId] = {
        message: '',
        timestamp: message.timestamp,
        messageId: message.messageId,
        threadId: message.threadId,
        state: MessageState.START,
        tools: [],
        errors: [],
        decisions: [],
        isHuman: false,
        sources: [],
        systemMessages: [],
      };

      return {
        ...state,
        messageOrderByThread: {
          ...state.messageOrderByThread,
          [state.currentThreadId]: nextOrder,
        },
        messages: nextMessages,
      };
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
  on(PaperChatActions.deleteThread, (state, {threadId}) => {
    if (!state.threadIds.includes(threadId)) {
      return state;
    }

    const remainingThreadIds = state.threadIds.filter(id => id !== threadId);

    const {[threadId]: _removedOrder, ...restOrder} = state.messageOrderByThread;
    const {[threadId]: _removedHeadline, ...restHeadline} = state.headlineByThread;

    const idsToDelete = state.messageOrderByThread[threadId] ?? [];
    const newMessages = {...state.messages};
    for (const mid of idsToDelete) {
      delete newMessages[mid];
    }

    let newCurrentThreadId = state.currentThreadId;
    let newThreadIds = remainingThreadIds;
    let newOrderByThread = restOrder;
    let newHeadlineByThread = restHeadline;

    if (state.currentThreadId === threadId) {
      if (remainingThreadIds.length > 0) {
        newCurrentThreadId = remainingThreadIds[remainingThreadIds.length - 1];
      } else {
        const freshId = uuidv4();
        newCurrentThreadId = freshId;
        newThreadIds = [freshId];
        newOrderByThread = {...newOrderByThread, [freshId]: []};
        newHeadlineByThread = {...newHeadlineByThread};
      }
    }

    return {
      ...state,
      threadIds: newThreadIds,
      currentThreadId: newCurrentThreadId,
      messageOrderByThread: newOrderByThread,
      headlineByThread: newHeadlineByThread,
      messages: newMessages,
    };
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
    if (!(message.messageId in state.messages) || message.messageType !== ChatMessageType.ERROR) {
      return state;
    }
    const sanityCheck = extractSanityCheckPayload(message.message);
    if (sanityCheck) {
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.messageId]: {
            ...state.messages[message.messageId],
            sanityCheckApproval: sanityCheck,
            sanityCheckPending: false,
            sanityCheckResolved: undefined,
          }
        },
      };
    }
    const violation = extractGuardrailViolation(message.message);
    if (violation) {
      const existing = state.messages[message.messageId].guardrailViolations ?? [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.messageId]: {
            ...state.messages[message.messageId],
            guardrailViolations: [...existing, violation],
          }
        },
      };
    }
    if (typeof message.message !== 'string') {
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
  on(PaperChatActions.approveSanityCheck, (state, {messageId}) => {
    if (!(messageId in state.messages)) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [messageId]: {
          ...state.messages[messageId],
          sanityCheckPending: true,
          sanityCheckResolved: 'APPROVED',
        }
      },
    };
  }),
  on(PaperChatActions.disableSanityCheck, (state, {messageId}) => {
    if (!(messageId in state.messages)) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [messageId]: {
          ...state.messages[messageId],
          sanityCheckPending: true,
          sanityCheckResolved: 'DISABLED',
        }
      },
    };
  }),
  on(PaperChatActions.declineSanityCheck, (state, {messageId}) => {
    if (!(messageId in state.messages)) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [messageId]: {
          ...state.messages[messageId],
          sanityCheckPending: false,
          sanityCheckResolved: 'DECLINED',
          sanityCheckError: undefined,
        }
      },
    };
  }),
  on(PaperChatActions.sanityCheckError, (state, {messageId, reason}) => {
    if (!(messageId in state.messages)) {
      return state;
    }
    return {
      ...state,
      messages: {
        ...state.messages,
        [messageId]: {
          ...state.messages[messageId],
          sanityCheckPending: false,
          sanityCheckResolved: undefined,
          sanityCheckError: reason,
        }
      },
    };
  }),
  on(PaperChatActions.receiveToolMessage, (state, {message}) => {
    if (!(message.messageId in state.messages) || message.messageType !== ChatMessageType.AI_TOOL) {
      return state;
    }
    const toolDto = message.message as ToolDTO;
    const currentTools = state.messages[message.messageId].tools ? state.messages[message.messageId].tools : [];

    const idx = currentTools.findIndex(t => t.id === toolDto.id);
    const tools = idx >= 0
      ? currentTools.map((t, i) => (i === idx ? {...t, ...toolDto} : t))
      : [...currentTools, toolDto];

    return {
      ...state,
      messages: {
        ...state.messages,
        [message.messageId]: {
          ...state.messages[message.messageId],
          tools: tools
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

/**
 * Returns the id of the most recent AI bubble whose sanity check was just
 * resolved (approved or skipped). When the backend follows up with a new bubble
 * after approval, that resolved parent gets deleted from state so the new
 * bubble replaces it visually.
 */
function findResolvedSanityCheckAncestor(
  state: PaperChatState,
  threadId: string,
): string | undefined {
  const order = state.messageOrderByThread[threadId];
  if (!order || order.length === 0) {
    return undefined;
  }
  const lastId = order[order.length - 1];
  const last = state.messages[lastId];
  if (!last || last.isHuman) {
    return undefined;
  }
  return last.sanityCheckResolved ? lastId : undefined;
}

function extractSanityCheckPayload(payload: unknown): SanityCheckApprovalDTO | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const obj = payload as { code?: unknown };
  if (obj.code !== PRE_EXECUTION_SANITY_CHECK_APPROVAL_REQUIRED) {
    return null;
  }
  return payload as SanityCheckApprovalDTO;
}

function extractGuardrailViolation(payload: unknown): GuardrailViolationDTO | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const obj = payload as { code?: unknown; guardrail?: unknown; message?: unknown };
  if (obj.code !== GUARDRAIL_VIOLATION_CODE || typeof obj.guardrail !== 'string') {
    return null;
  }
  return {
    code: GUARDRAIL_VIOLATION_CODE,
    guardrail: obj.guardrail,
    message: typeof obj.message === 'string' ? obj.message : '',
  };
}
