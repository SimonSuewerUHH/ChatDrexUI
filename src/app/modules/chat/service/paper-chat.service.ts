import {inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {v4 as uuidv4} from 'uuid';
import {Observable, Subject} from 'rxjs';
import {RequestDTO, ResponseDTO} from '../dto/paper-chat';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import {reconnectAttempt, reconnectReset, requestedMessage} from './paper-chat.actions';
import {MessageType} from '../dto/enums';
import {loadUserLLMModelSettingJSONString} from '../../../utils/models/llm-setting';

const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 60000;

@Injectable({
  providedIn: 'root',
})
export class PaperChatWebSocketService {
  private readonly store: Store = inject(Store);
  private socket$: WebSocketSubject<any> | null = null;
  private messageSubject = new Subject<ResponseDTO>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalDisconnect = false;

  connect(clientId: string): Observable<ResponseDTO> {
    let wsUrl = `${environment.wsBaseUrl}/${clientId}`;
    console.log('Connecting to WebSocket:', wsUrl);

    this.cancelPendingReconnect();
    this.intentionalDisconnect = false;

    // Clean up existing connection (do not propagate intentional close as failure).
    if (this.socket$) {
      this.tearDownSocket();
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
        // First successful payload after a retry cycle: reset backoff.
        if (this.reconnectAttempts !== 0) {
          this.reconnectAttempts = 0;
          this.store.dispatch(reconnectReset());
        }
        this.messageSubject.next(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error, 'url:', wsUrl);
        this.scheduleReconnect(clientId);
      },
      complete: () => {
        if (this.intentionalDisconnect) {
          return;
        }
        this.scheduleReconnect(clientId);
      },
    });

    return this.messageSubject.asObservable();
  }

  sendMessage(message: string, threadId: string): void {
    if (!this.socket$) {
      console.error('WebSocket is not connected');
      return;
    }
    const request: RequestDTO = {
      threadId: threadId,
      messageId: uuidv4(),
      message: message,
      messageType: MessageType.SENDING,
      timestamp: Math.floor(Date.now() / 1000),
    };
    this.socket$.next(request);
    this.store.dispatch(requestedMessage({requestedMessage: request}));
  }

  resendWithSanityCheck(
    message: string,
    threadId: string,
    options: {
      approved?: boolean;
      approvalId?: string;
      disabled?: boolean;
    },
  ): void {
    if (!this.socket$) {
      console.error('WebSocket is not connected');
      return;
    }
    const request: RequestDTO = {
      threadId: threadId,
      messageId: uuidv4(),
      message: message,
      messageType: MessageType.SENDING,
      timestamp: Math.floor(Date.now() / 1000),
      ...(options.approved
        ? {
            preExecutionSanityCheckApproved: true,
            preExecutionSanityCheckApprovalId: options.approvalId,
          }
        : {}),
      ...(options.disabled ? {preExecutionSanityCheckDisabled: true} : {}),
    };
    this.socket$.next(request);
  }

  disconnect(): void {
    console.log('Disconnecting WebSocket...');
    this.intentionalDisconnect = true;
    this.cancelPendingReconnect();
    this.tearDownSocket();
    if (this.messageSubject && !this.messageSubject.closed) {
      this.messageSubject.complete();
    }
  }

  private tearDownSocket(): void {
    if (this.socket$) {
      try {
        this.socket$.complete();
      } catch {
        // ignore
      }
      this.socket$ = null;
    }
  }

  private scheduleReconnect(clientId: string): void {
    if (this.intentionalDisconnect) {
      return;
    }
    this.cancelPendingReconnect();
    this.reconnectAttempts += 1;
    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(2, this.reconnectAttempts - 1),
      RECONNECT_MAX_MS,
    );
    this.store.dispatch(
      reconnectAttempt({attempt: this.reconnectAttempts, nextRetryMs: delay}),
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(clientId);
    }, delay);
  }

  private cancelPendingReconnect(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
