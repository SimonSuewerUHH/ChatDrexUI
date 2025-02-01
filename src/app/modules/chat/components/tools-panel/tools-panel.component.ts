import {Component, input} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {MatIconModule} from '@angular/material/icon';
import {DecisionPanelComponent} from '../decisions-panel/decision-panel.component';
import {ConversationPart, ToolDTO} from '../../dto/message';
import {ToolPanelComponent} from '../tool-panel/tool-panel.component';
import {Tools} from '../../dto/enums';
import {PaperCardComponent} from '../paper-card/paper-card.component';
import {PapersListComponent} from '../papers-list/papers-list.component';

@Component({
  selector: 'app-tools-panel',
  imports: [MatExpansionModule, PanelWrapperComponent, MatIconModule, DecisionPanelComponent, ToolPanelComponent, PapersListComponent],
  templateUrl: './tools-panel.component.html',
  styleUrl: './tools-panel.component.scss'
})
export class ToolsPanelComponent {
  readonly message = input.required<ConversationPart>();

  decisions: string[] = ['Decision 1', 'Decision 2', 'Decision 3'];


  getResearchTools(): ToolDTO[] {
    return this.message().tools.filter(this.isResearch);
  }

  getNonResearchTools(): ToolDTO[] {
    return this.message().tools.filter(tool => !this.isResearch(tool));
  }

  private isResearch(tool:ToolDTO): boolean {
    return tool.name === Tools.SEMANTIC_SCHOLAR;
  }
}
