import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, inject,
  input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {marked} from 'marked';
import {ToolSourceDTO} from '../../dto/message';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {ResearchPaperDialogComponent} from '../research-paper-dialog/research-paper-dialog.component';

@Component({
  selector: 'app-sourced-markdown',
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMarkdownComponent implements OnInit, OnChanges {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly dialog: MatDialog = inject(MatDialog);

  readonly markdown = input.required<string>();
  readonly sources = input.required<ToolSourceDTO[]>();
  readonly linkCountStartNumber = input<number>(1);

  private idMap: Record<string, number> = {};
  private linkCounter = 1;

  parsedMarkdown: SafeHtml = '';

  ngOnInit(): void {
    this.linkCounter = this.linkCountStartNumber();
    marked.use({
      hooks: {
        postprocess: (markdown: string) => this.postProcessMarkdown(markdown)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markdown']) {
      this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(marked.parse(this.markdown()) as string);
      this.cdr.detectChanges();
    }
  }

  private postProcessMarkdown(markdown: string): string {
    return markdown.replace(/\[[^\]]{0,40}\]/g, (match) => {
      const clearMatch = match.replace(/[\[\]]/g, '');
      if (!this.getPaper(clearMatch)) {
        return match;
      }
      if (!this.idMap[clearMatch]) {
        this.idMap[clearMatch] = this.linkCounter++;
      }
      const displayNumber = this.idMap[clearMatch];
      return `[<a href="#" data-ref="${clearMatch}" class="ref-link">${displayNumber}</a>]`;
    });
  }

  onLinkClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('ref-link')) {
      event.preventDefault();
      const refId = target.getAttribute('data-ref');
      if (refId) {
        const source = this.getPaper(refId);
        if (source) {
          this.dialog.open(ResearchPaperDialogComponent, {
            data: source
          });
        }
      }
    }
  }

  getPaper(paperId: string): ToolSourceDTO | undefined {
    if (!paperId) {
      return undefined;
    }
    return this.sources().find(source => source.paper_id === paperId);
  }


}
