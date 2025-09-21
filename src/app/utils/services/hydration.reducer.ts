import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import {PaperChatState} from '../../modules/chat/service/paper-chat.reducer';

const STORAGE_KEY = "state";

// Attempt to set an item; return true on success, false on failure
function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    // Swallow QuotaExceededError and any other storage errors
    console.warn("localStorage.setItem failed:", e);
    return false;
  }
}

// Stringify the state while trimming potentially huge fields
function stringifyState(state: PaperChatState): string {
  const seen = new WeakSet<object>();
  const MAX_STR = 10000; // cap very long strings
  const MAX_ARRAY = 100; // cap big arrays
  const blacklist = new Set(["messages", "history", "buffer", "raw", "logs", "attachments"]);

  return JSON.stringify(state as unknown as Record<string, unknown>, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value as object)) return "[Circular]";
      seen.add(value as object);
    }
    if (blacklist.has(key)) return undefined; // drop heavy fields by key
    if (Array.isArray(value)) return (value as unknown[]).slice(0, MAX_ARRAY);
    if (typeof value === "string" && value.length > MAX_STR) return (value as string).slice(0, MAX_STR);
    if (value instanceof Blob) return undefined; // avoid blobs
    return value;
  });
}


export const hydrationMetaReducer = (
  reducer: ActionReducer<PaperChatState>
): ActionReducer<PaperChatState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem(STORAGE_KEY);
      if (storageValue) {
        try {
          const parsedState = JSON.parse(storageValue);
          // Reset connection state on app initialization to prevent stale connections
          return {
            ...parsedState,
            connected: false,
            error: null
          };
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    const nextState = reducer(state, action);

    try {
      const payload = stringifyState(nextState);
      const ok = safeSetItem(STORAGE_KEY, payload);
      if (!ok) {
        // Fallback: persist a minimal subset that is very small
        const minimal = {
          connected: nextState?.connected ?? false,
          error: null
        } as Partial<PaperChatState>;
        safeSetItem(STORAGE_KEY, JSON.stringify(minimal));
      }
    } catch (e) {
      // As a last resort, avoid breaking the app due to storage errors
      console.warn("Failed to persist state to localStorage:", e);
    }

    return nextState;
  };
};
