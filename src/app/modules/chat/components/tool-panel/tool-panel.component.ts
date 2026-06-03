import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ToolDTO} from '../../dto/message';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-tool-panel',
  imports: [MatExpansionModule, MatIconModule],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolPanelComponent {
  readonly tool = input.required<ToolDTO>();
  readonly hideToggle = input<boolean>(false);

  readonly toolInputDisplay = computed(() => {
    const raw = this.tool().input;
    if (raw === null || raw === undefined || raw === '') {
      return '';
    }
    if (typeof raw === 'string') {
      return raw;
    }
    try {
      const s = JSON.stringify(raw);
      return s.length > 200 ? s.slice(0, 197) + '…' : s;
    } catch {
      return String(raw);
    }
  });
}
