
export enum MessageType {
  SENDING = 'sending',
  GET_ALL = 'get_all',
  RECEIVING_SINGLE = 'receiving:single',
  RECEIVING_ALL = 'receiving:all',
}

export interface RequestDTO {
  messageId: string;
  message: string;
  messageType: MessageType;
  timestamp: number;
}

export interface ChatResponseDTO {
  userInput: string;
  systemResponse: string;
  aiResponse: string;
}

export interface ResponseDTO {
  messageId: string;
  messages: ChatResponseDTO[];
  messageType: MessageType;
  timestamp: number;
}