import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { ToolDTO} from '../../dto/message';
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
}
