import {inject, Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {of, startWith, withLatestFrom} from 'rxjs';
import {catchError, filter, map, mergeMap, tap} from 'rxjs/operators';
import * as PaperChatActions from './paper-chat.actions';
import {PaperChatWebSocketService} from './paper-chat.service';
import {Store} from '@ngrx/store';
import {selectClientId} from './paper-chat.selector';
import {ChatMessageType} from '../dto/enums';
import {ResponseDTO} from '../dto/paper-chat';

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
          /*filter((data: ResponseDTO) =>
            [MessageType.RECEIVING_SINGLE, MessageType.RECEIVING_ALL, MessageType.RECEIVING_SYSTEM].includes(data.messageType)
          ),*/
          tap((data: ResponseDTO) => console.log('Received data:', data)),
          mergeMap((message) => message.messages),
          tap((data) => console.log('Received message:', data)),
          mergeMap((message) => {
            switch (message.messageType) {
              case ChatMessageType.API:
                return of(PaperChatActions.receiveAPIMessage({message}));
              case ChatMessageType.AI_TOOL:
                return of(PaperChatActions.receiveToolMessage({message}));
              default:
                return of(PaperChatActions.receiveAIMessage({message}));
            }
          }),
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
