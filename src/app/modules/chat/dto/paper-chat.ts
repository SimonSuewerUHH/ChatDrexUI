import {MessageDTO} from './message';
import {MessageType} from './enums';


export interface RequestDTO {
  token?: string;
  threadId: string;
  messageId: string;
  message: string;
  messageType: MessageType;
  timestamp: number;
  llmModel?: string;
  preExecutionSanityCheckApproved?: boolean;
  preExecutionSanityCheckApprovalId?: string;
  preExecutionSanityCheckDisabled?: boolean;
}

export interface ResponseDTO {
  messages: MessageDTO[];
  messageType: MessageType;
}
