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
