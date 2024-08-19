import { defineStore } from 'pinia'
import { socketService } from '@/service/chat'
import { MessageDTO, ChatMessageType } from '@/dto/message'
import { ResponseDTO } from '@/dto/request'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: {} as Record<string, MessageDTO[]>,
    currentChat: 0,
    isConnected: false,
    loading: false,
  }),
  actions: {
    bindEvents() {
      window.addEventListener('receiving:single', (event: Event) => this.handleSingleMessage(event as CustomEvent));
      window.addEventListener('receiving:all', (event: Event) => this.handleAllMessages(event as CustomEvent));

      socketService.onConnect(() => {
        debugger;
        this.isConnected = true
      })
      socketService.onDisconnect(() => {
        debugger;
        this.isConnected = false
      })
    },
    handleSingleMessage(event: CustomEvent) {
      debugger;
      const data: ResponseDTO = event.detail;
      this.addMessage({
        message: data.messages[0].aiResponse,
        messageType: ChatMessageType.AI,
        timestamp: data.timestamp,
        messageId: data.messageId,
      });
      this.addMessage({
        message: data.messages[0].systemResponse,
        messageType: ChatMessageType.SYSTEM,
        timestamp: data.timestamp,
        messageId: data.messageId,
      });
      this.loading = false;

    },
    handleAllMessages(event: CustomEvent) {
      debugger;
      const data: ResponseDTO = event.detail;
      this.chats[this.currentChat] = []

      data.messages.forEach(msg => {
        this.addMessage({
          message: data.messages[0].userInput,
          messageType: ChatMessageType.HUMAN,
          timestamp: data.timestamp,
          messageId: data.messageId,
        });
        this.addMessage({
          message: data.messages[0].aiResponse,
          messageType: ChatMessageType.AI,
          timestamp: data.timestamp,
          messageId: data.messageId,
        });
        this.addMessage({
          message: data.messages[0].systemResponse,
          messageType: ChatMessageType.SYSTEM,
          timestamp: data.timestamp,
          messageId: data.messageId,
        });
      });
      this.loading = false;
    },
    addMessage(message: MessageDTO) {
      if (!this.chats[this.currentChat]) {
        this.chats[this.currentChat] = []
      }
      debugger;
      this.chats[this.currentChat].push(message)
    },
    sendMessage(message: string) {
      this.loading = true;
      const req = socketService.sendMessage(message)
      if (req == null) {
        this.loading = false;
      }else {
        this.addMessage({
          message: req.message,
          messageType: ChatMessageType.HUMAN,
          timestamp: req.timestamp,
          messageId: req.messageId,
        });
      }
    },
    setCurrentRoom(chatId: number) {
      this.currentChat = chatId
      this.bindEvents()
    },
    connect() {
      this.currentChat = Date.now()
      socketService.connect(this.currentChat)
    }
  },
  getters: {
    getCurrentChatMessages: (state) => {
      return state.chats[state.currentChat] || []
    },
    hasMessages: (state) => {
      return (state.chats[state.currentChat] || []).length > 0
    }
  }
})