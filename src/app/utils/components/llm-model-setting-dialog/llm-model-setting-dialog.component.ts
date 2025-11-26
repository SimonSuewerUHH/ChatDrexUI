import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatRadioModule} from '@angular/material/radio';
import {MatIcon} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {environment} from '../../../../environments/environment';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';
import {CloseableDialogComponent} from '../closeable-dialog/closeable-dialog.component';
import {
  clearUserLLMModelSetting,
  defaultUserLLMModelSetting,
  LlmType,
  loadUserLLMModelSetting,
  MaxTokenPerModel,
  saveUserLLMModelSetting,
  UserLLMModelSetting
} from '../../models/llm-setting';
import {DeviceIdService} from '../../services/device-id.service';
import {required, max, min, form, Field} from '@angular/forms/signals';


interface OllamaModel {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-llm-model-setting-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatIcon,
    MatExpansionModule,
    MatDivider,
    CloseableDialogComponent,
    Field
  ],
  templateUrl: './llm-model-setting-dialog.component.html',
  styleUrl: './llm-model-setting-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlmModelSettingDialogComponent {
  private deviceIdService: DeviceIdService = inject(DeviceIdService);
  private readonly dialogRef: MatDialogRef<LlmModelSettingDialogComponent> = inject(MatDialogRef);

  readonly settingModel = signal<UserLLMModelSetting>(loadUserLLMModelSetting(true) ?? defaultUserLLMModelSetting);

  currentMaxTokens: number = 32768

  //https://ollama.com/search?c=tools
  ollamaModels: OllamaModel[] = [
    {value: 'mistral:7b', viewValue: 'mistral:7b'},
    {value: 'deepseek-r1:8b', viewValue: 'deepseek-r1:8b'},
    {value: 'gpt-oss:latest', viewValue: 'gpt-oss:20b'},
    {value: 'llama3.3:70b', viewValue: 'llama3.3:70b'},
    {value: 'qwen3:8b', viewValue: 'qwen3:8b'},
    {value: 'gemma3:latest', viewValue: 'gemma3:latest'},
    {value: 'smollm2:latest', viewValue: 'smollm2:latest'},
    {value: 'qwen2.5:latest', viewValue: 'qwen2.5:latest'},
  ];


  //https://platform.openai.com/docs/models
  chatGPTModels: OllamaModel[] = [
    {value: 'gpt-5.1-2025-11-13', viewValue: 'gpt-5.1'},
    {value: 'gpt-5-mini-2025-08-07', viewValue: 'gpt-5-mini'},
    {value: 'gpt-5-pro-2025-10-06', viewValue: 'gpt-5-pro'},
    {value: 'gpt-5-nano-2025-08-07', viewValue: 'gpt-5-nano'},
  ];


  //https://ai.google.dev/gemini-api/docs/models?hl=de#gemini-3-pro
  geminiGPTModels: OllamaModel[] = [
    {value: 'gemini-2.0-flash', viewValue: 'gemini-2.0-flash'},
    {value: 'gemini-3-pro-preview', viewValue: 'gemini-3-pro preview'},
    {value: 'gemini-2.5-pro', viewValue: 'gemini-2.5-pro'},
  ];


  readonly form = form(
    this.settingModel,
    (path) => {
      required(path.selectedLLM, { message: 'You must select an LLM' });

      required(path.temperature, { message: 'Temperature is required' });
      min(path.temperature, 0, { message: 'Temperature cannot be < 0' });
      max(path.temperature, 2, { message: 'Temperature cannot be > 2' });
      required(path.topK, { message: 'TopK is required' });
      min(path.topK, 0, { message: 'TopK must be ≥ 0' });
      required(path.topP, { message: 'topP is required' });
      min(path.topP, 0, { message: 'topP must be ≥ 0' });
      max(path.topP, 1, { message: 'topP cannot be >1' });

      required(path.repeatPenalty, { message: 'Repeat penalty is required' });
      min(path.repeatPenalty, 1, { message: 'Repeat penalty must be ≥1' });
      required(path.seed, { message: 'Seed is required' });

      min(path.numPredict, -1, { message: 'numPredict must be ≥ -1' });
      max(path.numPredict, 8192, { message: 'numPredict cannot exceed 8192' });
      min(path.numCtx, 1, { message: 'numCtx must be ≥1' });
      max(path.numCtx, this.currentMaxTokens, { message: `numCtx cannot exceed ${this.currentMaxTokens}` });
    }
  );

  clearSetting(): void {
    this.settingModel.set(defaultUserLLMModelSetting);
    this.form().reset();
  }

  deleteSettings(): void {
    clearUserLLMModelSetting();
    this.clearSetting();
  }

  onConfirm(): void {
    if (this.form().valid()) {
      const value = this.form().value();
      saveUserLLMModelSetting(value);
      this.dialogRef.close(true);
    }
  }

  isOllamaEnabled(): boolean {
    return this.form.selectedLLM().value() === LlmType.OLLAMA;
  }

  isChatGptEnabled(): boolean {
    return this.form.selectedLLM().value() === LlmType.CHATGPT;
  }

  isGeminiEnabled(): boolean {
    return this.form.selectedLLM().value() === LlmType.GEMINI;
  }


  toggleMaximize(isMaximized: boolean): void {
    if (isMaximized) {
      this.dialogRef.updateSize('100vw', '100vh');
    } else {
      this.dialogRef.updateSize('600px', '600px');
    }
  }

  protected readonly LlmType = LlmType;
  protected readonly isProduction: boolean = environment.production;
}
