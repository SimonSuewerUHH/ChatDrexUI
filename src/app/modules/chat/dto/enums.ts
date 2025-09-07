export enum ChatMessageType {
  HUMAN = 'HUMAN',
  AI = 'AI',
  AI_TOOL = 'AI_TOOL',
  REASONING = 'REASONING',
  SYSTEM = 'SYSTEM',
  AI_RESEARCH = 'AI_RESEARCH',
  API = 'API',
  ERROR = 'ERROR',
}


export enum Tools {
  SEMANTIC_SCHOLAR = 'SEMANTIC_SCHOLAR', //TODO CHANGE
  RESEARCH = 'RESEARCH',
  UNIPROD = 'UNIPROD',
  MYGENE = 'MYGENE',
  NETDREX = 'NETDREX',
  DIGEST = 'DIGEST',
  NETDREX_KG = 'NETDREX_KG',
  NETDREX_TOOL = 'NETDREX_TOOL',
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
