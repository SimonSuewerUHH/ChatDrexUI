import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {DisclaimerDialogComponent} from '../disclaimer-dialog/disclaimer-dialog.component';
import {newChat} from '../../../chat/service/paper-chat.actions';

interface HomeExample {
  tag: string;
  text: string;
}

interface Capability {
  icon: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-start-page',
  imports: [MatIcon, MatButton, RouterLink],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly store: Store = inject(Store);

  readonly year = new Date().getFullYear();
  readonly disclaimerAccepted = signal(false);

  readonly examples = signal<HomeExample[]>([
    {tag: 'Expression', text: 'Which proteins are known to be expressed in the liver?'},
    {tag: 'DIGEST', text: 'Apply DIGEST to test whether O75431, Q3SYG4 form a statistically significant disease module.'},
    {tag: 'DIAMOnD', text: 'Use the DIAMOnD algorithm to expand the seed gene set LAG3, PRKCB, MTOR, FOS, IL2, MYC, NFKB1.'},
    {tag: 'Pathways', text: 'What are the pathways associated with proteins encoded by the gene CFTR?'},
    {tag: 'Annotation', text: 'Provide the gene type and description for the APC gene.'},
  ]);

  readonly capabilities = signal<Capability[]>([
    {icon: 'search', title: 'Query routing', body: 'Interprets natural-language questions and dispatches them to the right specialized agent.'},
    {icon: 'build', title: 'Algorithm execution', body: 'Runs DIAMOnD, DIGEST and network-medicine methods over the NeDRex knowledge graph.'},
    {icon: 'hub', title: 'Result visualization', body: 'Turns modules, rankings and pathways into readable, interactive output.'},
    {icon: 'menu_book', title: 'Literature mining', body: 'Retrieves and ranks supporting evidence from PubMed and Europe PMC.'},
    {icon: 'psychology', title: 'Scientific interpretation', body: 'Synthesizes findings into cited, hypothesis-ready summaries.'},
    {icon: 'verified', title: 'Reasoning & validation', body: 'A transparency module flags low-confidence claims and possible hallucinations.'},
  ]);

  stepLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  /** Route into the chat and kick off the agent run with this example. */
  startChat(text: string): void {
    this.store.dispatch(newChat({message: text}));
  }

  openDisclaimer(): void {
    this.dialog
      .open(DisclaimerDialogComponent, {
        width: 'min(760px, 92vw)',
        disableClose: false,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (accepted) {
          this.disclaimerAccepted.set(true);
        }
      });
  }
}
