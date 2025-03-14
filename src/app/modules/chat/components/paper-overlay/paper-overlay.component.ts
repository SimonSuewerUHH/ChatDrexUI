import {Component, signal} from '@angular/core';
import {ToolSourceDTO} from '../../dto/message';
import {PaperCardComponent} from '../paper-card/paper-card.component';

@Component({
  selector: 'app-paper-overlay',
  imports: [
    PaperCardComponent
  ],
  templateUrl: './paper-overlay.component.html',
  styleUrl: './paper-overlay.component.scss'
})
export class PaperOverlayComponent {
  paper = signal<ToolSourceDTO | undefined>(undefined);

}
