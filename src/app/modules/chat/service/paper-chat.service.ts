import {inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {v4 as uuidv4} from 'uuid';
import {Observable, Subject} from 'rxjs';
import {RequestDTO, ResponseDTO} from '../dto/paper-chat';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import {requestedMessage} from './paper-chat.actions';
import {MessageType} from '../dto/enums';
import {loadUserLLMModelSettingJSONString} from '../../../utils/models/llm-setting';

@Injectable({
  providedIn: 'root',
})
export class PaperChatWebSocketService {
  private readonly store: Store = inject(Store);
  private socket$: WebSocketSubject<any> | null = null;
  private messageSubject = new Subject<ResponseDTO>();

  connect(clientId: string): Observable<ResponseDTO> {
    let wsUrl = `${environment.wsBaseUrl}/${clientId}`;
    console.log('Connecting to WebSocket:', wsUrl);
    // Clean up existing connection
    if (this.socket$) {
      this.disconnect();
    }
    const storedSetting = loadUserLLMModelSettingJSONString();
    if (storedSetting) {
      const base64: string = btoa(storedSetting);
      wsUrl += `?llmsetting=${base64}`;
    }

    // Create new message subject for this connection
    this.messageSubject = new Subject<ResponseDTO>();
    this.socket$ = webSocket(wsUrl);

    this.socket$.subscribe({
      next: (message: any) => {
        console.log('WebSocket message received:', message);
        this.messageSubject.next(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        console.error('WebSocket URL was:', wsUrl);
        this.reconnect(clientId);
      },
      complete: () => {
        console.log('WebSocket connection closed');
        this.reconnect(clientId);
      },
    });

    return this.messageSubject.asObservable();
  }

  sendMessage(message: string, threadId: string): void {
    if (this.socket$) {
      const request: RequestDTO = {
        threadId: threadId,
        messageId: uuidv4(),
        message: message,
        messageType: MessageType.SENDING,
        timestamp: Math.floor(Date.now() / 1000),
      };
      this.socket$.next(request);
      this.store.dispatch(requestedMessage({requestedMessage: request}));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    console.log('Disconnecting WebSocket...');
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    if (this.messageSubject && !this.messageSubject.closed) {
      this.messageSubject.complete();
    }
  }

  reconnect(projectId: string): void {
    console.log('Reconnecting in 5 seconds...');
    if (this.socket$) {
      this.disconnect();
    }
    setTimeout(() => this.connect(projectId), 5000);
  }
}
