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

      this.socketService.getSingleMessage().subscribe((data: ResponseDTO) => {
        this.handleSingleMessage(data);
      });
      this.socketService.getAllMessage().subscribe((data: ResponseDTO) => {
        this.conversations[this.currentConversation] = new ConversationDTO();
        this.handleSingleMessage(data);
      });
      this.socketService.getSystemMessage().subscribe((data: ResponseDTO) => {
        console.log('handleSystemMessage', data);
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
      });

      this.socketService.isConnected().subscribe((data:boolean) => {
        this.isConnected = data;
      });
    },
    handleSingleMessage(data: ResponseDTO) {
      data.messages.forEach(msg => {
        this.addConversation(msg);
      });
      this.loading = false;
    },
    checkConversation() {
      if (!this.conversations[this.currentConversation]) {
        this.conversations[this.currentConversation] = new ConversationDTO()
      }
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
      if(!this.isConnected) {
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
      this.socketService = null;
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
      this.bindEvents();
      return this.currentConversation;
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
    }
  }
})