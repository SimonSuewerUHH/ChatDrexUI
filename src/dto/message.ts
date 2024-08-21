import { DrugstOneGraph } from '@/dto/network'

export enum ChatMessageType {
  HUMAN = 'human',
  AI = 'ai',
  SYSTEM = 'system',
  API = 'api',
  ERROR = 'error',

}

export interface MessageDTO {
  message: string | SystemMessageDTO;
  messageType: ChatMessageType;
  timestamp: number;
  messageId: string;
}


export interface SystemMessageDTO {
  drugstOneNetwork?: DrugstOneGraph
}

export class ConversationDetailDTO {
  messages: MessageDTO[];
  loaded?: boolean;
  timestamp: number;
  errors: string[];

  constructor(timestamp: number) {
    this.messages = [];
    this.timestamp = timestamp;
    this.errors = [];
  }

  public push(message: MessageDTO) {
    this.messages.push(message);
  }

  getRequestMessage() {
    return this.messages.find(msg => msg.messageType === ChatMessageType.HUMAN);
  }

  getResponseMessages() {
    return this.messages.filter(msg => msg.messageType !== ChatMessageType.HUMAN)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

}


export class ConversationDTO {
  messages: Map<string, ConversationDetailDTO>;

  constructor() {
    this.messages = new Map<string, ConversationDetailDTO>();
  }

  checkStorage(message: MessageDTO) {
    const msgId = message.messageId.replaceAll('-', '').toLowerCase();
    if (!this.messages.has(msgId)) {
      this.messages.set(msgId, new ConversationDetailDTO(message.timestamp));
    }
    return msgId;
  }

  addMessage(message: MessageDTO) {
    const messageId = this.checkStorage(message);
    this.messages.get(messageId)!.push(message);
  }

  addError(message: MessageDTO) {
    const messageId = this.checkStorage(message);
    this.messages.get(messageId)!.errors.push(message.message as string);
  }

  addLoading(message: MessageDTO, loaded = true) {
    const messageId = this.checkStorage(message);
    this.messages.get(messageId)!.loaded = loaded;
  }

  hasMessages() {
    return this.messages.size > 0;
  }

  getMessagesHistory() {
    return Array.from(this.messages.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(entry => entry[0]);
  }

  getRequestMessage(messageId: string) {
    return this.messages.get(messageId)?.getRequestMessage();
  }

  getResponseMessages(messageId: string) {
    return this.messages.get(messageId)?.getResponseMessages();
  }

  getLoaded(messageId: string) {
    return this.messages.get(messageId)?.loaded;
  }

  getErrors(messageId: string) {
    return this.messages.get(messageId)?.errors;
  }
}
