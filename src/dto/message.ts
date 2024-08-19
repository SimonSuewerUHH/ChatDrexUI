export enum ChatMessageType {
  HUMAN = 'human',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface MessageDTO {
  message: string;
  messageType: ChatMessageType;
  timestamp: number;
  messageId: string;
}