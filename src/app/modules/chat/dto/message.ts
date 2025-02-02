import {ChatMessageType, MessageState} from './enums';


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
}

export interface ToolDTO {
  id: string; // randum uuid
  name: string;
  started: boolean;
  content?: string | ToolSourceDTO[]; // HERE WE CAN DEFINE CLEAR STRUCTURE FOR TOOL CONTENT LIKE PAPER; BUT WE NEED TO STORE
  input: any;
}

export interface ToolSourceDTO {
  paper_id: string;
  doi: string;
  title: string;
  published_year: number;
  authors: string;
  journal: string;
  abstract: string | null;
}

export interface ToolSourceInputDTO {
  query: string;
}

export interface SystemMessageDTO {
  //drugstOneNetwork?: DrugstOneGraph;
  url?: string;
}

export interface ResearchResultsDTO {
  answer: string;
}
