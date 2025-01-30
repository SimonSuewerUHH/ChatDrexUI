import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ProcessInfoState} from './process-info.reducer';

export const selectProcessInfoState = createFeatureSelector<ProcessInfoState>('processInfo');

export const selectProcessInfoByProjectId = (projectId: number) =>
  createSelector(selectProcessInfoState, (state) => state.messagesByProject[projectId] || []);

export const selectProcessLastInfo = () =>
  createSelector(selectProcessInfoState, (state) => state.lastMessage);


export const selectShowLoading = () =>
  createSelector(selectProcessInfoState, (state) => state.showLoading);

export const selectShowMessage = () =>
  createSelector(selectProcessInfoState, (state) => state.showMessage);


export const selectIsConnected = () =>
  createSelector(selectProcessInfoState, (state) => state.streamStarted);

export const selectError = () =>
  createSelector(selectProcessInfoState, (state) => state.error);
