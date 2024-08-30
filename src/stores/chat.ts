import { defineStore } from 'pinia'
import { SocketService } from '@/service/chat'
import { MessageDTO, ChatMessageType, ConversationDTO, ConversationOverview } from '@/dto/message'
import { ResponseDTO } from '@/dto/request'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: {} as Record<string, ConversationDTO>,
    socketService: null as SocketService | null,
    currentConversation: "0",
    isConnected: false,
    loading: false,
  }),
  actions: {
    bindEvents() {
      if (!this.socketService) {
        console.warn('Socket is not initialized');
        return;
      }
      window.addEventListener('receiving:single', (event: Event) => this.handleSingleMessage(event as CustomEvent));
      window.addEventListener('receiving:all', (event: Event) => this.handleAllMessages(event as CustomEvent));
      window.addEventListener('receiving:system', (event: Event) => this.handleSystemMessage(event as CustomEvent));


      this.socketService.onConnect(() => {
        this.isConnected = true
      })
      this.socketService.onDisconnect(() => {
        this.isConnected = false
      })
    },
    removeEvents() {
      window.removeEventListener('receiving:single', (event: Event) => this.handleSingleMessage(event as CustomEvent));
      window.removeEventListener('receiving:all', (event: Event) => this.handleAllMessages(event as CustomEvent));
      window.removeEventListener('receiving:system', (event: Event) => this.handleSystemMessage(event as CustomEvent));
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
      if(!this.socketService) {
        this.connect();
      }
      if(!this.socketService) {
        console.warn('Socket is not initialized');
        return;
      }
      this.loading = true;
      const req = this.socketService.sendMessage(message)
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
    setCurrentConversation(chatId: string) {
      const conversation = this.conversations[chatId];
      if (!conversation) {
        console.error(`Conversation with ID ${chatId} does not exist`);
        return false;
      }
      this.currentConversation = chatId;
      this.bindEvents();
      return true;
    },
    disconnect() {
      if(this.socketService) {
        this.socketService.disconnect();
      }
      this.isConnected = false;
      this.socketService = null;
      this.removeEvents();
    },
    connect() {
      this.currentConversation = Date.now().toString();
      if(this.isConnected) {
        this.disconnect();
      }
      this.socketService = new SocketService(this.currentConversation);
      if (!this.socketService) {
        console.warn('Socket is not initialized');
        return;
      }
      this.socketService.connect(this.currentConversation);
      this.bindEvents();
    }
  },
  getters: {
    getCurrentConversation: (state) => {
      return state.conversations[state.currentConversation];
    },
    getConversations: (state) => {
      return Object.entries(state.conversations).map(
        ([key, value]) => {
          return new ConversationOverview(value, key)
        }
      );
    },
    hasMessages: (state) => {
      return state.conversations[state.currentConversation] && state.conversations[state.currentConversation].hasMessages()
    },
    isSocketConnected: (state) => {
      return state.isConnected;
    }
  }
})