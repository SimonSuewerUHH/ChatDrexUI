import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {GuardrailViolationDTO} from '../../dto/message';

@Component({
  selector: 'app-guardrail-violation-panel',
  imports: [MatIconModule],
  templateUrl: './guardrail-violation-panel.component.html',
  styleUrl: './guardrail-violation-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuardrailViolationPanelComponent {
  readonly violations = input.required<GuardrailViolationDTO[]>();

  title(guardrail: string): string {
    switch (guardrail) {
      case 'PROMPT_INJECTION':
        return 'Prompt injection detected';
      default:
        return 'Guardrail blocked this request';
    }
  }

  description(guardrail: string, message: string): string {
    if (message) {
      return message;
    }
    switch (guardrail) {
      case 'PROMPT_INJECTION':
        return 'Your message was flagged by the prompt-injection guardrail and was not executed.';
      default:
        return 'Your message was blocked by a guardrail and was not executed.';
    }
  }

  icon(guardrail: string): string {
    switch (guardrail) {
      case 'PROMPT_INJECTION':
        return 'gpp_bad';
      default:
        return 'shield';
    }
  }
}
