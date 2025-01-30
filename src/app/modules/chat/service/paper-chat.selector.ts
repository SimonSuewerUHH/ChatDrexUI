import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PaperChatState } from './paper-chat.reducer';

// Feature Selector
export const selectPaperChatFeature = createFeatureSelector<PaperChatState>('paperChat');

// Select Messages by ClientId
export const selectCurrentMessages = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.messagedByThread[state.currentThreadId] || []
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
export const selectCurrentThreadId = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.currentThreadId
);


export const selectClientId = createSelector(
  selectPaperChatFeature,
  (state: PaperChatState) => state.clientId
);

