import { defineStore } from 'pinia'
import { socketService } from '@/service/chat'
import { MessageDTO, ChatMessageType, ConversationDTO } from '@/dto/message'
import { ResponseDTO } from '@/dto/request'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: {} as Record<string, ConversationDTO>,
    currentConversation: 0,
    isConnected: false,
    loading: false,
  }),
  actions: {
    bindEvents() {
      window.addEventListener('receiving:single', (event: Event) => this.handleSingleMessage(event as CustomEvent));
      window.addEventListener('receiving:all', (event: Event) => this.handleAllMessages(event as CustomEvent));
      window.addEventListener('receiving:system', (event: Event) => this.handleSystemMessage(event as CustomEvent));


      socketService.onConnect(() => {
        this.isConnected = true
      })
      socketService.onDisconnect(() => {
        this.isConnected = false
      })
    },
    handleSingleMessage(event: CustomEvent) {
      const data: ResponseDTO = event.detail;
      data.messages.forEach(msg => {
        this.addConversation(msg);
      });
      this.loading = false;

    },
    handleSystemMessage(event: CustomEvent) {
      const data: ResponseDTO = event.detail;
      console.log('handleSystemMessage', data);
      debugger;
      data.messages.forEach(msg => {
        if (msg.messageType === ChatMessageType.ERROR) {
          this.addError(msg);
        }
        if (msg.messageType === ChatMessageType.API) {
          const messageText = (msg.message as string).toUpperCase();
          if (messageText === 'STOP') {
            this.addLoading(msg, true);
          }else if (messageText === 'START') {
            this.addLoading(msg, false);
          }else {
            console.warn('Unknown system message:', msg.message);
          }
        }
      });
      this.loading = false;

    },
    checkConversation() {
      if (!this.conversations[this.currentConversation]) {
        this.conversations[this.currentConversation] = new ConversationDTO()
      }
    },
    handleAllMessages(event: CustomEvent) {
      this.conversations[this.currentConversation] = new ConversationDTO();
      this.handleSingleMessage(event);
    },
    addConversation(message: MessageDTO) {
      this.checkConversation();
      this.conversations[this.currentConversation].addMessage(message)
    },
    addError(message: MessageDTO) {
      console.log('addError', message)
      this.checkConversation();
      this.conversations[this.currentConversation].addError(message)
    },
    addLoading(message: MessageDTO, loaded = true) {
      console.log('addLoading', message)
      this.checkConversation();
      this.conversations[this.currentConversation].addLoading(message, loaded)
    },
    sendMessage(message: string) {
      this.loading = true;
      const req = socketService.sendMessage(message)
      if (req == null) {
        this.loading = false;
      }else {
        this.addConversation({
          message: req.message,
          messageType: ChatMessageType.HUMAN,
          timestamp: req.timestamp,
          messageId: req.messageId,
        });
      }
    },
    setCurrentRoom(chatId: number) {
      this.currentConversation = chatId
      this.bindEvents()
    },
    connect() {
      this.currentConversation = Date.now()
      socketService.connect(this.currentConversation)
    }
  },
  getters: {
    getCurrentConversation: (state) => {
      return state.conversations[state.currentConversation];
    },
    hasMessages: (state) => {
      return state.conversations[state.currentConversation] && state.conversations[state.currentConversation].hasMessages()
    }
  }
})