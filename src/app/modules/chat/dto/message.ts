import {MessageState} from './paper-chat';

export enum ChatMessageType {
  HUMAN = 'human',
  AI = 'ai',
  AI_TOOL = 'aiTool',
  SYSTEM = 'system',
  AI_RESEARCH = 'research',
  API = 'api',
  ERROR = 'error',
}

export interface MessageDTO {
  message: string | SystemMessageDTO | ResearchResultsDTO;
  messageType: ChatMessageType;
  timestamp: number;
  messageId: string;
  threadId: string;
  state?: MessageState
}


export interface ToolDTO {
  name: string;
  started: boolean;
  content: any; // HERE WE CAN DEFINE CLEAR STRUCTURE FOR TOOL CONTENT LIKE PAPER; BUT WE NEED TO STORE
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

export interface SystemMessageDTO {
  //drugstOneNetwork?: DrugstOneGraph;
  url?: string;
}

export interface ResearchResultsDTO {
  answer: string;
}

export class ConversationDetailDTO {
  messages: MessageDTO[];
  loaded?: boolean;
  timestamp: number;
  tools: ToolDTO[];
  errors: string[];

  constructor(timestamp: number) {
    this.messages = [];
    this.timestamp = timestamp;
    this.errors = [];
    this.tools = [];
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
    if (message.messageType === ChatMessageType.AI_TOOL) {

      this.addTool(message);
    }else if (message.messageType === ChatMessageType.AI || message.messageType === ChatMessageType.AI_RESEARCH || message.messageType === ChatMessageType.HUMAN || message.messageType === ChatMessageType.SYSTEM) {
      this.messages.get(messageId)!.push(message);
    }
  }

  addTool(message: MessageDTO) {
    const messageId = this.checkStorage(message);
    let toolName = message.message as string;
    if(toolName.toLowerCase().startsWith("start")){
      toolName = toolName.replace("START", "");
      this.messages.get(messageId)!.tools.push({
        started: true,
        content: null,
        input: null,
        name: toolName
      });
    }else if(toolName.toLowerCase().startsWith("stop")){
      const oldTool = this.messages.get(messageId)!.tools.at(-1);
      if(oldTool && oldTool.started) {
        oldTool.started = false;
      }
    }else if(toolName.toLowerCase().startsWith("content")){
      const toolContent = toolName.replace("CONTENT", "");
      const oldTool = this.messages.get(messageId)!.tools.at(-1);
      if(oldTool && oldTool.started) {
        oldTool.content = toolContent;
        oldTool.started = false;
      }
    }else if(toolName.toLowerCase().startsWith("input")){
      const toolContent = toolName.replace("INPUT", "");
      const oldTool = this.messages.get(messageId)!.tools.at(-1);
      if(oldTool && oldTool.started) {
        oldTool.input = toolContent;
      }
    }

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

  getTools(messageId: string) {
    return this.messages.get(messageId)?.tools;
  }
}


export class ConversationOverview {
  firstMessage: string;
  sessionId: string;

  constructor(conv: ConversationDTO, sessionId: string) {
    const fM = conv.getMessagesHistory()[0];
    this.firstMessage = conv.getRequestMessage(fM)?.message as string;
    this.sessionId = sessionId;
  }
}
