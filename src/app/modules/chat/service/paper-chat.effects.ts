import {inject, Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {concatMap, from, of, startWith, withLatestFrom} from 'rxjs';
import {catchError, filter, map, mergeMap, tap} from 'rxjs/operators';
import * as PaperChatActions from './paper-chat.actions';
import {PaperChatWebSocketService} from './paper-chat.service';
import {Action, Store} from '@ngrx/store';
import {selectClientId} from './paper-chat.selector';
import {ChatMessageType} from '../dto/enums';
import {ResponseDTO} from '../dto/paper-chat';
import {receiveReasoningMessage} from './paper-chat.actions';

@Injectable()
export class PaperChatEffects {
  private readonly store: Store = inject(Store);
  private readonly wsService: PaperChatWebSocketService = inject(PaperChatWebSocketService);
  private readonly actions$: Actions = inject(Actions);

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
}
