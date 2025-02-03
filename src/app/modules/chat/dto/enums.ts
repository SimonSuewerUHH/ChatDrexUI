export enum ChatMessageType {
  HUMAN = 'human',
  AI = 'ai',
  AI_TOOL = 'aiTool',
  REASONING = 'reasoning',
  SYSTEM = 'system',
  AI_RESEARCH = 'research',
  API = 'api',
  ERROR = 'error',
}


export enum Tools{
  SEMANTIC_SCHOLAR = 'semanticscholar',
}


export enum MessageState {
  START = 'START',
  END = 'END',
  MESSAGE = 'MESSAGE'
}


export enum MessageType {
  SENDING = 'sending',
  GET_ALL = 'get_all',
  RECEIVING_SINGLE = 'receiving:single',
  RECEIVING_SYSTEM = 'receiving:system',
  RECEIVING_ALL = 'receiving:all',
}
