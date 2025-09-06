import {ChatMessageType, MessageState} from './enums';
import {DrugstOneGraph} from './network';


export interface MessageDTO {
  message: string | SystemMessageDTO | ResearchResultsDTO;
  messageType: ChatMessageType;
  timestamp: number;
  messageId: string;
  threadId: string;

}


export interface ConversationPart {
  message: string;
  timestamp: number;
  messageId: string;
  threadId: string;
  state?: MessageState
  tools: ToolDTO[];
  sources: ToolSourceDTO[];
  errors: string[];
  decisions: string[];
  isHuman: boolean;
  systemMessages: MessageDTO[];
}

export interface ToolDTO {
  id: string; // randum uuid
  name: string;
  started: boolean;
  content?: string | ToolSourceDTO[]; // HERE WE CAN DEFINE CLEAR STRUCTURE FOR TOOL CONTENT LIKE PAPER; BUT WE NEED TO STORE
  input: any;
}

export interface ToolSourceDTO {
  paperId: string;
  doi: string;
  title: string;
  publishedYear: number;
  authors: string;
  journal: string;
  abstract: string | null;
}

export interface ToolSourceInputDTO {
  query: string;
}

export interface SystemMessageDTO {
  drugstOneNetwork?: DrugstOneGraph;
  url?: string;
}

export interface ResearchResultsDTO {
  answer: string;
}
