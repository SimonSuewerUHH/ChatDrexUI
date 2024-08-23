import { MessageType, RequestDTO, ResponseDTO } from '@/dto/request'
import { uuid } from 'vue-uuid';
import { toResponseDTO } from '@/utils/helper'

class SocketService {
  private socket: WebSocket | null = null;
  private client_id: number;
  private wsUrl: string;

  constructor() {
    this.client_id = Date.now();
    // import.meta.env.VITE_API_URL ||
    this.wsUrl = import.meta.env.VITE_API_URL || 'ws://localhost:8000/ws';
  }

  onConnect(callback: (data: any) => void) {
    if (!this.socket) {
      console.warn('Socket is not initialized');
      return;
    }
    this.socket.onopen = callback;
  }
  onDisconnect(callback: (data: any) => void) {
    if (!this.socket) {
      console.warn('Socket is not initialized');
      return;
    }
    this.socket.onclose = callback;
  }
  sendMessage(message: string): RequestDTO | null {
    if (!this.socket) {
      console.warn('Socket is not initialized');
      return null;
    }
    const request: RequestDTO = {
      messageId: uuid.v4(),
      message: message,
      messageType: MessageType.SENDING,
      timestamp: Date.now(),
    }

    this.socket.send(JSON.stringify(request));
    return request
  }

  private handleResponse(data: ResponseDTO) {
    if(!data) {
      console.warn('Data is empty');
      return;
    }
    switch (data.messageType) {
      case MessageType.RECEIVING_SINGLE:
        this.emitEvent('receiving:single', data);
        break;
      case MessageType.RECEIVING_ALL:
        this.emitEvent('receiving:all', data);
        break;
      case MessageType.RECEIVING_SYSTEM:
        this.emitEvent('receiving:system', data);
        break
      default:
        console.warn('Unknown message type:', data.messageType);
    }
  }

  private emitEvent(event: string, data: ResponseDTO) {
    const customEvent = new CustomEvent(event, { detail: data });
    window.dispatchEvent(customEvent);
  }

  connect(client_id: number) {
    this.client_id = client_id;
    if (this.socket) {
      if(this.socket.readyState === WebSocket.OPEN) {
        console.warn('Socket is already connected');
        return;
      }
      this.socket.close();
    }
    this.socket = new WebSocket(`${this.wsUrl}/${this.client_id}`);
    this.socket.onmessage = (event) => {
      const data: ResponseDTO = toResponseDTO(event.data);
      this.handleResponse(data);
    };
  }

  disconnect() {
    if (!this.socket) {
      console.warn('Socket is not initialized');
      return;
    }
    this.socket.close();
    this.socket = null;
  }
}

export const socketService = new SocketService();