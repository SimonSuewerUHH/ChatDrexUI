import {ChatMessageType, MessageState} from './enums';
import {DrugstOneGraph, DrugstOneNetwork} from './network';
import {DigestPlotDTO} from './digest';


export interface MessageDTO {
  message: string | ResearchResultsDTO | ToolDTO;
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
  content?: string[];
  structuredContent?: ToolStructuredContentDTO[];
  input: any;
}

export interface ToolStructuredContentDTO {
  content?: ToolSourceDTO | DrugstOneNetwork | DigestPlotDTO | ToolFileResponseDTO;
  type: ToolStructuredContentType;
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

export interface ToolFileResponseDTO {
  path: string;
  name: string;
  type: ToolFileResponseType;
}

export enum ToolStructuredContentType {
  SOURCE = "SOURCE",
  DRUGST_ONE = "DRUGST_ONE",
  DIGEST = "DIGEST",
  FILE = "FILE",
}

export enum ToolFileResponseType {
  CSV = "CSV",
  PNG = "PNG",
  URL = "URL",
  DOWNLOAD = "DOWNLOAD",
  IFRAME = "IFRAME"
}

export interface SystemMessageDTO {
  drugstOneNetwork?: DrugstOneGraph;
  url?: string;
}

export interface ResearchResultsDTO {
  answer: string;
}
