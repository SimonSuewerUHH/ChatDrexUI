import {createReducer, on} from '@ngrx/store';
import * as ProcessInfoActions from './process-info.actions';

export interface ProcessInfoState {
  messagesByProject: { [projectId: number]: string };
  lastMessage: string | null;
  showLoading: boolean;
  showMessage: boolean;
  error: string | null;
  streamStarted: boolean;
}

export const initialState: ProcessInfoState = {
  messagesByProject: {},
  showLoading: false,
  showMessage: false,
  error: null,
  lastMessage: null,
  streamStarted: false,
};

export const processInfoReducer = createReducer(
  initialState,
  on(ProcessInfoActions.receiveProcessInfoMessage, (state, {message}) => ({
    ...state,
    messagesByProject: {
      ...state.messagesByProject,
      [message.projectId]: message.message,
    },
    lastMessage: message.message,
    showMessage: true,
  })),
  on(ProcessInfoActions.startLoadingProcessInfoSseStream, (state, {}) => ({
    ...state,
    showLoading: true,
  })),
  on(ProcessInfoActions.stopLoadingProcessInfoSseStream, (state, {}) => ({
    ...state,
    showLoading: false,
  })),
  on(ProcessInfoActions.showLoadingProcessInfoSseStream, (state, {}) => ({
    ...state,
    showMessage: true,
  })),
  on(ProcessInfoActions.hideLoadingProcessInfoSseStream, (state, {}) => ({
    ...state,
    showMessage: false,
  })),
  on(ProcessInfoActions.startProcessInfoSseStream, (state, {}) => ({
    ...state,
    error: null,
    streamStarted: true,
  })),
  on(ProcessInfoActions.processInfoStreamError, (state, {error}) => ({
    ...state,
    error: error,
    streamStarted: false,
  })),
  on(ProcessInfoActions.sseStreamCompleted, (state, {}) => ({
    ...state,
    streamStarted: false,
  })),
);
