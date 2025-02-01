import {Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-panel-wrapper',
  imports: [ MatIconModule],
  templateUrl: './panel-wrapper.component.html',
  styleUrl: './panel-wrapper.component.scss'
})
export class PanelWrapperComponent {
  readonly header = input.required<string>();
}
