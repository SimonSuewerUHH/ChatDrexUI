import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import {PaperChatState} from '../../modules/chat/service/paper-chat.reducer';


export const hydrationMetaReducer = (
  reducer: ActionReducer<PaperChatState>
): ActionReducer<PaperChatState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem("state");
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
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    debugger;
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
