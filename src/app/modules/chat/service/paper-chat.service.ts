import {inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {v4 as uuidv4} from 'uuid';
import {Observable, Subject} from 'rxjs';
import {MessageType, RequestDTO, ResponseDTO} from '../dto/paper-chat';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import {connectToWebsocket, requestedMessage} from './paper-chat.actions';

@Injectable({
  providedIn: 'root',
})
export class PaperChatWebSocketService {
  private readonly store: Store = inject(Store);
  private socket$: WebSocketSubject<any> | null = null;
  private messageSubject = new Subject<ResponseDTO>();
  private clientId?: string;

  connect(clientId: string): Observable<ResponseDTO> {
    if (!clientId) {
      clientId = uuidv4();
    }
    this.clientId = clientId;

    if (this.socket$) {
      this.disconnect();
    }
    this.messageSubject = new Subject<ResponseDTO>();
    this.socket$ = webSocket(`${environment.wsBaseUrl}/${this.clientId}`);

    this.socket$.subscribe({
      next: (message: any) => this.messageSubject.next(message),
      error: (error) => {
        console.error('WebSocket error:', error);
        this.reconnect(clientId);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      },
    });

    return this.messageSubject.asObservable();
  }

  sendMessage(message: string, threadId: string): void {
    debugger;

    if (this.socket$) {
      const token = "TODO"
      const request: RequestDTO = {
        token: token,
        threadId: threadId,
        messageId: uuidv4(),
        message: message,
        messageType: MessageType.SENDING,
        timestamp: Date.now()
      };
      this.socket$.next(request);
      this.store.dispatch(requestedMessage({requestedMessage: request}));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.messageSubject.complete();
  }

  reconnect(projectId: string): void {
    console.log('Reconnecting in 5 seconds...');
    if (this.socket$) {
      this.disconnect();
    }
    setTimeout(() => this.connect(projectId), 5000);
  }
}
