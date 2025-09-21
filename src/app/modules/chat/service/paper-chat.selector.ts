import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PaperChatState} from './paper-chat.reducer';

// Feature Selector
export const selectPaperChatFeature = createFeatureSelector<PaperChatState>('paperChat');

// Select Messages by ClientId
export const selectCurrentMessages = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => {
    const messageIds = state.messageOrderByThread[state.currentThreadId] || [];
    return messageIds.map(id => state.messages[id])
      .filter(msg => !!msg)
      .filter(msg => !!msg.timestamp)
  }
);

// Select Connected Status by ClientId
export const selectConnected = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.connected || false
);


// Select Errors by ClientId
export const selectCurrentError = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.error || null
);

//Select current ClientId
export const selectCurrentThreadId = () => createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.currentThreadId
);


export const selectClientId = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.clientId
);


export const getAllHeadlines = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.headlineByThread
);
export const getAllThreadIds = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.threadIds
);



