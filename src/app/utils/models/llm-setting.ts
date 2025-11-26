export enum LlmType {
  OLLAMA = 'OLLAMA',
  CHATGPT = 'CHATGPT',
  GEMINI = 'GEMINI',
}

export interface UserLLMModelSetting {
  selectedLLM: LlmType;
  ollamaBaseUrl: string;
  chatGptModel: string;
  chatGptApiKey: string;

  geminiModel: string;
  geminiApiKey: string;

  semanticScholarApiKey: string;
}

export const defaultUserLLMModelSetting: UserLLMModelSetting = {
  chatGptModel: 'gpt-oss:latest',
  selectedLLM: LlmType.OLLAMA,

  semanticScholarApiKey: '',
  ollamaBaseUrl: 'https://chat.cosy.bio/api',
  chatGptApiKey: '',
  geminiModel: '',
  geminiApiKey: '',
}

export interface MaxTokenPerModelEntry {
  value: string;
  maxTokens: number;
}

export class MaxTokenPerModel {
  private static readonly models: MaxTokenPerModelEntry[] = [
    {value: 'mistral:7b', maxTokens: 32768},
    {value: 'gemma2:9b', maxTokens: 8192},
    {value: 'gemma3:latest', maxTokens: 131072},
    {value: 'llama3.2:latest', maxTokens: 131072},
    {value: 'llama3.3:70b', maxTokens: 131072},
    {value: 'gemma2:27b', maxTokens: 8192},
    {value: 'smollm2:latest', maxTokens: 8192},
    {value: 'qwen2.5:latest', maxTokens: 32768},
    {value: 'gpt-4o-mini', maxTokens: 128000},
    {value: 'gpt-4o', maxTokens: 128000},
    {value: 'gemini-2.0-flash', maxTokens: 1000000},
    {value: 'gemini-1.5-flash', maxTokens: 1000000},
    {value: 'gemini-1.5-flash-8b', maxTokens: 100000}
  ];

  public static fromValue(value: string): MaxTokenPerModelEntry | undefined {
    return this.models.find(model => model.value === value);
  }

  public static getMaxTokens(value: string): number {
    const model = this.fromValue(value);
    return model ? model.maxTokens : 25000; // Default falls nicht gefunden
  }
}

export function loadUserLLMModelSettingJSONString(): string | null {
  return localStorage.getItem(`chatdrex:user-llm-model-setting`);
}

export function loadUserLLMModelSetting(withDefault?: boolean): UserLLMModelSetting | null {
  const json = loadUserLLMModelSettingJSONString();
  if (json) {
    return JSON.parse(json);
  }
  if (withDefault) {
    return defaultUserLLMModelSetting;
  }
  return null;
}


export function hasSemanticAPIKey(): boolean {
  const settings: UserLLMModelSetting | null = loadUserLLMModelSetting(false);
  return !!(settings && settings.semanticScholarApiKey);
}

export function saveUserLLMModelSetting(setting: UserLLMModelSetting): void {
  localStorage.setItem(`chatdrex:user-llm-model-setting`, JSON.stringify(setting));
}

export function clearUserLLMModelSetting(): void {
  localStorage.removeItem(`chatdrex:user-llm-model-setting`);
}

