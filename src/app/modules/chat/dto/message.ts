import {ChatMessageType, MessageState} from './enums';
import {DrugstOneDTO} from './network';
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
  sanityCheckApproval?: SanityCheckApprovalDTO;
  sanityCheckPending?: boolean;
  sanityCheckResolved?: 'APPROVED' | 'DISABLED' | 'DECLINED';
  sanityCheckError?: string;
  guardrailViolations?: GuardrailViolationDTO[];
}

export const GUARDRAIL_VIOLATION_CODE = 'GUARDRAIL_VIOLATION';

export interface GuardrailViolationDTO {
  code: string;
  guardrail: string;
  message: string;
}

export const PRE_EXECUTION_SANITY_CHECK_APPROVAL_REQUIRED =
  'PRE_EXECUTION_SANITY_CHECK_APPROVAL_REQUIRED';

export type SanityCheckQuestionAction =
  | 'CALL_NEDREX_TOOL'
  | 'CALL_DIGEST_TOOL'
  | 'FETCH_KG'
  | 'FETCH_RESEARCH'
  | 'FETCH_BIO_INFO'
  | 'UPDATE_NETWORK'
  | 'HELP'
  | 'FINALIZE';

export interface SanityCheckQuestionActionPair {
  question: string;
  action: SanityCheckQuestionAction | string;
  rationale: string;
}

export interface SanityCheckPlan {
  approvalRequired: boolean;
  userIntent: string;
  riskReason: string;
  questionActionPairs: SanityCheckQuestionActionPair[];
}

export interface SanityCheckReview {
  plainEnglishSummary: string;
  uncertainties?: string[];
}

export interface SanityCheckApprovalDTO {
  code: string;
  message: string;
  approvalRequired: boolean;
  canDisable: boolean;
  approvalId: string;
  plan: SanityCheckPlan;
  review: SanityCheckReview;
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
  content?: ToolSourceDTO | DrugstOneDTO | DigestPlotDTO | ToolFileResponseDTO;
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


export interface ResearchResultsDTO {
  answer: string;
}
