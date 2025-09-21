import {Component, input} from '@angular/core';
import {ConversationPart, ToolDTO, ToolSourceDTO, ToolStructuredContentType} from '../../dto/message';
import {Tools} from '../../dto/enums';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {ToolPanelComponent} from '../tool-panel/tool-panel.component';
import {PapersListComponent} from '../papers-list/papers-list.component';

@Component({
  selector: 'app-research-overview',
  imports: [
    MatExpansionModule,
    MatIconModule,
    ToolPanelComponent,
    PapersListComponent],
  templateUrl: './research-overview.component.html',
  styleUrl: './research-overview.component.scss'
})
export class ResearchOverviewComponent {
  readonly message = input.required<ConversationPart>();


  getResearchTools(): ToolDTO[] {
    return this.message().tools.filter(this.isResearch);
  }

  getResearchToolOutput(tool: ToolDTO): ToolSourceDTO[] {

    const content = tool.structuredContent as any[];
    if (!content || content.length == 0) {
      return [];
    }
    return content
      .filter(tool => tool?.type === ToolStructuredContentType.SOURCE)
      .map(tool => tool?.content as ToolSourceDTO)
      .filter(source => !!source);
  }

  private isResearch(tool: ToolDTO): boolean {
    return tool.name === Tools.RESEARCH;
  }

}
