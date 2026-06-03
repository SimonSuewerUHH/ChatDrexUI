import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-decisions-panel',
  imports: [MatIconModule],
  templateUrl: './decision-panel.component.html',
  styleUrl: './decision-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionPanelComponent {
  readonly decisions = input.required<string[]>();
}
