import { MessageType, RequestDTO, ResponseDTO } from '@/dto/request'
import { uuid } from 'vue-uuid'
import { filter, fromEvent, map, merge, Observable, tap } from 'rxjs'
import { toResponseDTO } from '@/utils/helper'
import { useAuthStore } from '@/stores/auth'

export class SocketService {
  private socket: WebSocket | null = null
  private client_id: string
  private wsUrl: string
  private $messages: Observable<ResponseDTO> | null = null
  private $connected: Observable<boolean> | null = null
  private authStore

  constructor(client_id: string = Date.now().toString()) {
    this.client_id = client_id
    //import.meta.env.VITE_API_URL ||
    this.wsUrl = 'ws://localhost:8000/ws'
    this.authStore = useAuthStore()
  }


  onConnect() {
    if (!this.socket) {
      console.warn('Socket is not initialized')
      return
    }

    this.$messages = fromEvent<MessageEvent>(this.socket, 'message').pipe(
      map((event) => toResponseDTO(event.data)),
      filter((data: ResponseDTO) =>
        [MessageType.RECEIVING_SINGLE, MessageType.RECEIVING_ALL, MessageType.RECEIVING_SYSTEM].includes(data.messageType)
      )
    )


    fromEvent<CloseEvent>(this.socket, 'error').subscribe((error) => {
      console.error('WebSocket error:', error)
    })

    this.$connected = merge(
      fromEvent<Event>(this.socket, 'open').pipe(tap(console.log), map((event) => true)),
      fromEvent<Event>(this.socket, 'close').pipe(tap(console.log), map((event) => false))
    )
  }

  sendMessage(message: string, threadId: string): RequestDTO | null {
    if (!this.socket) {
      console.warn('Socket is not initialized')
      return null
    }
    const token = this.authStore.token
    const request: RequestDTO = {
      token: token,
      threadId: threadId,
      messageId: uuid.v4(),
      message: message,
      messageType: MessageType.SENDING,
      timestamp: Date.now()
    }

    this.socket.send(JSON.stringify(request))
    return request
  }

  public isConnected(): Observable<boolean> {
    if (!this.$connected) {
      console.warn('Socket is not initialized')
      return new Observable()
    }
    return this.$connected
  }

  public getSingleMessage(): Observable<ResponseDTO> {
    if (!this.$messages) {
      console.warn('Events are not initialized')
      return new Observable()
    }
    return this.$messages.pipe(
      filter((event) => event.messageType === MessageType.RECEIVING_SINGLE)
    )
  }

  public getAllMessage(): Observable<ResponseDTO> {
    if (!this.$messages) {
      console.warn('Events are not initialized')
      return new Observable()
    }
    return this.$messages.pipe(
      filter((event) => event.messageType === MessageType.RECEIVING_ALL)
    )
  }

  public getSystemMessage(): Observable<ResponseDTO> {
    if (!this.$messages) {
      console.warn('Events are not initialized')
      return new Observable()
    }
    return this.$messages.pipe(
      filter((event) => event.messageType === MessageType.RECEIVING_SYSTEM))
  }

  connect() {
    debugger;
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) {
        console.warn('Socket is already connected')
        return
      }
      this.socket.close()
    }
    this.socket = new WebSocket(`${this.wsUrl}/${this.client_id}`)
    this.onConnect()
  }

  disconnect() {
    if (!this.socket) {
      console.warn('Socket is not initialized')
      return
    }
    this.socket.close()
    this.socket = null


    if (this.$connected) {
      this.$connected = null
    }

    if (this.$messages) {
      this.$messages = null
    }
  }
}

