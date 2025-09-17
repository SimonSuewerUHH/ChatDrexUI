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
  RESEARCH = 'RESEARCH',
  UNIPROD = 'UNIPROD',
  MYGENE = 'MYGENE',
  NEDREX = 'NEDREX',
  DIGEST = 'DIGEST',
  NEDREX_KG = 'NEDREX_KG',
  NEDREX_TOOL = 'NEDREX_TOOL',
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
