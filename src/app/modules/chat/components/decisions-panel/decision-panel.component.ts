import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { MatListItemIcon, MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-decisions-panel',
  imports: [MatListModule, MatIconModule, MatListItemIcon
  ],
  templateUrl: './decision-panel.component.html',
  styleUrl: './decision-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionPanelComponent {
  readonly decisions = input.required<string[]>();

}
