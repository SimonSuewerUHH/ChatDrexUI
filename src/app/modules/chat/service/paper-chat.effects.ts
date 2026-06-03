import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {delay, from, of, startWith, withLatestFrom} from 'rxjs';
import {catchError, filter, map, mergeMap, tap} from 'rxjs/operators';
import * as PaperChatActions from './paper-chat.actions';
import {PaperChatWebSocketService} from './paper-chat.service';
import {Action, Store} from '@ngrx/store';
import {
  getAllThreadIds,
  selectClientId,
  selectPaperChatFeature,
} from './paper-chat.selector';
import {ChatMessageType} from '../dto/enums';
import {v4 as uuidv4} from 'uuid';
import {Router} from '@angular/router';
import {reconnectToWebsocket} from './paper-chat.actions';
import {PaperChatState} from './paper-chat.reducer';
import {ConversationPart} from '../dto/message';

function findOriginalHumanMessage(
  state: PaperChatState,
  threadId: string,
  aiMessageId: string,
): ConversationPart | undefined {
  for (const order of Object.values(state.messageOrderByThread)) {
    const idx = order.indexOf(aiMessageId);
    if (idx < 0) {
      continue;
    }
    for (let i = idx - 1; i >= 0; i--) {
      const part = state.messages[order[i]];
      if (part?.isHuman && typeof part.message === 'string' && part.message.length > 0) {
        return part;
      }
    }
    return undefined;
  }
  return undefined;
}

@Injectable()
export class PaperChatEffects {
  private readonly store: Store = inject(Store);
  private readonly wsService: PaperChatWebSocketService = inject(PaperChatWebSocketService);
  private readonly actions$: Actions = inject(Actions);
  private readonly router: Router = inject(Router);

  // Handle connection to the project
  connectToProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.connectToWebsocket),
      withLatestFrom(this.store.select(selectClientId)),
      mergeMap(([{}, clientId]) =>
        this.wsService.connect(clientId).pipe(
          mergeMap(response => from(response.messages)),
          map((message) => {
            const actionMap: any = {
              [ChatMessageType.API]: PaperChatActions.receiveAPIMessage,
              [ChatMessageType.AI_TOOL]: PaperChatActions.receiveToolMessage,
              [ChatMessageType.REASONING]: PaperChatActions.receiveReasoningMessage,
              [ChatMessageType.SYSTEM]: PaperChatActions.receiveSystemMessage,
              [ChatMessageType.AI]: PaperChatActions.receiveAIMessage,
              [ChatMessageType.ERROR]: PaperChatActions.receiveErrorMessage,
            }
            const actionCreator = actionMap[message.messageType];
            if (actionCreator) {
              console.log(`${message.messageType} message received:`, message);
              return actionCreator({message});
            } else {
              console.warn("Unexpected messageType received:", message.messageType, message);
              return null;
            }
          }),
          filter((action): action is Action => !!action),
          startWith(PaperChatActions.connectSuccess()),
          catchError((error) =>
            of(PaperChatActions.connectFailure({error}))
          )
        )
      )
    )
  );

  // Handle sending messages to the project
  sendMessageToProject$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaperChatActions.sendMessage),
        tap(({threadId, message}) => this.wsService.sendMessage(message, threadId)),
        map(({threadId}) => ({type: '[WebSocket] Message Sent', threadId})), // Optional success action placeholder
        catchError(({error}) =>
          of(PaperChatActions.connectFailure({error}))
        )
      ),
    {dispatch: false} // No further state update required for sending a message
  );

  // Retry: re-ask the user question that produced a given AI message.
  retryMessage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaperChatActions.retryMessage),
        withLatestFrom(this.store.select(selectPaperChatFeature)),
        tap(([{messageId}, state]) => {
          const ai = state.messages[messageId];
          if (!ai) {
            return;
          }
          const original = findOriginalHumanMessage(state, ai.threadId, messageId);
          if (!original) {
            return;
          }
          this.wsService.sendMessage(original.message, original.threadId);
        }),
      ),
    {dispatch: false}
  );

  // Handle disconnection from the project
  disconnectFromProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.disconnect),
      tap(() => this.wsService.disconnect()),
      map(() => PaperChatActions.disconnectSuccess()),
      catchError(({error}) =>
        of(PaperChatActions.disconnectFailure({error}))
      )
    )
  );


  connectToNewChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.newChat),
      mergeMap(({threadId, message}) => {
          threadId = threadId || uuidv4();
          return of(PaperChatActions.connectToChatSuccess({threadId}), PaperChatActions.sendMessage({threadId, message}))
        }
      ),
      catchError(() =>
        of(PaperChatActions.connectToChatFailure())
      )
    )
  );

  connectToChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.connectToChat),
      withLatestFrom(this.store.select(getAllThreadIds)),
      mergeMap(([{threadId}, threadIds]) =>
        // Always allow connection - threadId will be added to state if it doesn't exist
        of(PaperChatActions.connectToChatSuccess({threadId}))
      ),
      catchError(() =>
        of(PaperChatActions.connectToChatFailure())
      )
    )
  );

  connectToChatSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaperChatActions.connectToChatSuccess),
        tap(({threadId}) => this.router.navigate(['/chat/' + threadId]))
      ),
    {dispatch: false}
  );

  deleteHistory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaperChatActions.deleteHistory),
        tap(() => this.router.navigate(['/introduction/home']))
      ),
    {dispatch: false}
  );

  connectToChatFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaperChatActions.connectToChatFailure),
        tap(() => this.router.navigate(['/chat/new'])),
      ),
    {dispatch: false}
  );

  // Note: low-level WebSocket reconnects are handled inside PaperChatWebSocketService
  // with exponential backoff. This effect just logs the failure (and avoids the
  // previous double-retry loop where both service and effect re-issued connects).
  connectToFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaperChatActions.connectFailure),
        tap(({error}) => console.error('Failed to connect to chat', error)),
      ),
    {dispatch: false},
  );

  approveSanityCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.approveSanityCheck),
      withLatestFrom(this.store.select(selectPaperChatFeature)),
      mergeMap(([{messageId, messageText}, state]) => {
        const ai = state.messages[messageId];
        if (!ai?.sanityCheckApproval) {
          return of(
            PaperChatActions.sanityCheckError({
              messageId,
              reason: 'This sanity-check request is no longer available.',
            }),
          );
        }
        const original = findOriginalHumanMessage(state, ai.threadId, messageId);
        const editedRaw = typeof messageText === 'string' ? messageText.trim() : '';
        if (!original && editedRaw.length === 0) {
          return of(
            PaperChatActions.sanityCheckError({
              messageId,
              reason:
                'Could not find your original message and the editor was empty. Please retype your request.',
            }),
          );
        }
        const edited = editedRaw.length > 0 && (!original || editedRaw !== original.message.trim());
        const messageToSend = edited ? editedRaw : original!.message;
        const threadId = original?.threadId ?? ai.threadId;
        this.wsService.resendWithSanityCheck(messageToSend, threadId, {
          approved: true,
          approvalId: edited ? undefined : ai.sanityCheckApproval.approvalId,
        });
        return of();
      }),
    ),
  );

  disableSanityCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.disableSanityCheck),
      withLatestFrom(this.store.select(selectPaperChatFeature)),
      mergeMap(([{messageId}, state]) => {
        const ai = state.messages[messageId];
        if (!ai?.sanityCheckApproval) {
          return of(
            PaperChatActions.sanityCheckError({
              messageId,
              reason: 'This sanity-check request is no longer available.',
            }),
          );
        }
        const original = findOriginalHumanMessage(state, ai.threadId, messageId);
        if (!original) {
          return of(
            PaperChatActions.sanityCheckError({
              messageId,
              reason:
                'Could not find your original message to resend. Please retype your request.',
            }),
          );
        }
        this.wsService.resendWithSanityCheck(original.message, original.threadId, {
          disabled: true,
        });
        return of();
      }),
    ),
  );

  reConnectToChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperChatActions.reconnectToWebsocket),
      tap(() => console.error("Reconnect to chat")),
      tap(() => this.wsService.disconnect()),
      delay(1000),
      map(() => PaperChatActions.connectToWebsocket()),
      catchError(() =>
        of(PaperChatActions.connectToChatFailure())
      )
    )
  );
}
