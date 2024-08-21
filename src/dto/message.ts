import { DrugstOneGraph } from '@/dto/network'

export enum ChatMessageType {
  HUMAN = 'human',
  AI = 'ai',
  SYSTEM = 'system',
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



export class ConversationDTO {
  messages: Map<string, MessageDTO[]>;
  timestamps: Map<string, number>;

  constructor() {
    this.messages = new Map<string, MessageDTO[]>();
    this.timestamps = new Map<string, number>();
  }

  addMessage(message: MessageDTO) {
    const messageId = message.messageId.replaceAll('-', '').toLowerCase();
    if (!this.messages.has(messageId)) {
      this.messages.set(messageId, []);
      this.timestamps.set(messageId, message.timestamp);
    }
    this.messages.get(messageId)!.push(message);
  }

  hasMessages() {
    return this.messages.size > 0;
  }

  getMessagesHistory() {
    return Array.from(this.timestamps.entries())
      .sort((a, b) => a[1] - b[1])
      .map(entry => entry[0]);
  }

  getRequestMessage(messageId: string) {
    return this.messages.get(messageId)?.find(msg => msg.messageType === ChatMessageType.HUMAN);
  }

  getResponseMessages(messageId: string) {
    return this.messages.get(messageId)?.filter(msg => msg.messageType !== ChatMessageType.HUMAN)
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}
