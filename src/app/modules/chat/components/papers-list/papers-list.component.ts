import {Component, input} from '@angular/core';
import {ToolSourceDTO} from '../../dto/message';
import {PaperCardComponent} from '../paper-card/paper-card.component';

@Component({
  selector: 'app-papers-list',
  imports: [
    PaperCardComponent
  ],
  templateUrl: './papers-list.component.html',
  styleUrl: './papers-list.component.scss'
})
export class PapersListComponent {
  readonly tool = input<string | ToolSourceDTO[]>();
  readonly showAbstract = input<boolean>();
  readonly showAuthor = input<boolean>();

  isPaper() {
    if(!this.tool()) {
      return false;
    }
    return !(typeof this.tool() === 'string');
  }

  getPapers() {
    return this.tool() as ToolSourceDTO[];
  }

}
