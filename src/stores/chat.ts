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
    checkConversation(threadId?: string | undefined) {
      if (!threadId) {
        threadId = this.currentConversation;
      }
      if (!this.conversations[threadId]) {
        this.conversations[threadId] = new ConversationDTO()
      }
    },
    addConversation(message: MessageDTO) {
      debugger;
      const threadId = message.threadId;
      this.checkConversation(threadId);
      this.conversations[threadId].addMessage(message)
    },
    addError(message: MessageDTO) {
      console.log('addError', message)
      const threadId = message.threadId;
      this.checkConversation(threadId);
      this.conversations[threadId].addError(message)
    },
    addLoading(message: MessageDTO, loaded = true) {
      console.log('addLoading', message)
      const threadId = message.threadId;
      this.checkConversation(threadId);
      this.conversations[threadId].addLoading(message, loaded)
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
      const req = this.socketService.sendMessage(message, this.currentConversation);
      if (req == null) {
        this.loading = false;
      }else {
        this.addConversation({
          threadId: this.currentConversation,
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
      return true;
    },
    disconnect() {
      if(this.socketService) {
        this.socketService.disconnect();
      }
      this.socketService = null;
    },
    createNewConversation() {
      this.currentConversation = Date.now().toString();
      this.conversations[this.currentConversation] = new ConversationDTO();
      return this.currentConversation;
    },
    connect() {
      if(this.isConnected) {
        return;
      }
      this.socketService = new SocketService();
      if (!this.socketService) {
        console.warn('Socket is not initialized');
        return;
      }
      this.socketService.connect();
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
    }
  }
})