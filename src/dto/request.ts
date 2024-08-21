import { MessageDTO } from '@/dto/message'

export enum MessageType {
  SENDING = 'sending',
  GET_ALL = 'get_all',
  RECEIVING_SINGLE = 'receiving:single',
  RECEIVING_SYSTEM = 'receiving:system',
  RECEIVING_ALL = 'receiving:all',
}

export interface RequestDTO {
  messageId: string;
  message: string;
  messageType: MessageType;
  timestamp: number;
}

export interface ResponseDTO {
  messages: MessageDTO[];
  messageType: MessageType;
}