import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  SecurityContext,
  signal,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {marked} from 'marked';
import {ToolSourceDTO} from '../../dto/message';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {ResearchPaperDialogComponent} from '../research-paper-dialog/research-paper-dialog.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {PaperOverlayComponent} from '../paper-overlay/paper-overlay.component';
import {NedrexInfoDialogComponent} from '../nedrex-info-dialog/nedrex-info-dialog.component';

@Component({
  selector: 'app-sourced-markdown',
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMarkdownComponent implements OnInit, OnChanges, OnDestroy {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly overlay: Overlay = inject(Overlay);


  readonly markdown = input.required<string>();
  readonly sources = input.required<ToolSourceDTO[]>();
  readonly linkCountStartNumber = input<number>(1);

  private idMap: Record<string, number> = {};
  private linkCounter = 1;

  parsedMarkdown: SafeHtml = '';
  private tooltipOverlayRef: OverlayRef | null = null;

  ngOnInit(): void {
    this.linkCounter = this.linkCountStartNumber();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markdown']) {
      const markdown = marked.parse(this.markdown() ?? '') as string;
      const post = this.postProcessMarkdown(markdown);
      // Sanitize against XSS before trusting the HTML. Our post-processor adds
      // anchors/spans that pass through the sanitizer safely.
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, post) ?? '';
      this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(sanitized);
      this.cdr.detectChanges();
    }
  }

  copyCode(event: MouseEvent): void {
    const btn = (event.target as HTMLElement).closest('button.copy-code-btn') as HTMLButtonElement | null;
    if (!btn) {
      return;
    }
    event.preventDefault();
    const code = btn.parentElement?.querySelector('code')?.textContent ?? '';
    if (!code) {
      return;
    }
    navigator.clipboard?.writeText(code).then(() => {
      const original = btn.getAttribute('data-label') ?? 'Copy';
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    }).catch(() => {
      btn.textContent = 'Copy failed';
    });
  }

  ngOnDestroy(): void {
    if (this.tooltipOverlayRef) {
      this.tooltipOverlayRef.dispose();
    }
  }

  private postProcessMarkdown(markdown: string): string {
    // Wrap <pre><code>…</code></pre> blocks with a copy button.
    markdown = markdown.replace(
      /<pre><code(\s[^>]*)?>([\s\S]*?)<\/code><\/pre>/g,
      (_m, attrs = '', body) =>
        `<div class="code-block-wrapper">` +
          `<button type="button" class="copy-code-btn" data-label="Copy">Copy</button>` +
          `<pre><code${attrs ?? ''}>${body}</code></pre>` +
        `</div>`,
    );

    // Tag marked output with design-system classes (.md-h2/.md-h3/.md-p/.md-ul/.md-ol/.md-quote/.md-hr/.md-code).
    markdown = markdown
      .replace(/<h1>/g, '<h1 class="md-h2">')
      .replace(/<h2>/g, '<h2 class="md-h2">')
      .replace(/<h3>/g, '<h3 class="md-h3">')
      .replace(/<h4>/g, '<h4 class="md-h4">')
      .replace(/<p>/g, '<p class="md-p">')
      .replace(/<ul>/g, '<ul class="md-ul">')
      .replace(/<ol>/g, '<ol class="md-ol">')
      .replace(/<blockquote>/g, '<blockquote class="md-quote">')
      .replace(/<hr>/g, '<hr class="md-hr" />')
      .replace(/<code>/g, '<code class="md-code">');

    let replaced = markdown.replace(/(\[([^\]\s]{1,40})\]|\(([^\)\s]{1,40})\))/g, (match, _whole, squareId, parenId) => {
      const clearMatch = (squareId || parenId);
      if (!this.getPaper(clearMatch)) {
        return match;
      }
      if (!this.idMap[clearMatch]) {
        this.idMap[clearMatch] = this.linkCounter++;
      }
      const displayNumber = this.idMap[clearMatch];
      return `<a href="#" data-ref="${clearMatch}" class="ref-link cite-chip" data-cite="${displayNumber}">${displayNumber}</a>`;
    });
    replaced = replaced.replace(/\[NeDRex\]/g, (_match) => {
      return "<span class='badge'>NeDRex</span>"
    });
    replaced = replaced.replace(/\b(drugbank|uniprot|entrez)[:\.][^\]\s]+/gi, (_m) => {
      const splitted = _m.split(/[:\.]/);
      if (splitted.length > 1) {
        const cleanedId = splitted[1].replace(/<.*$/, '');
        const cleanedPrefix = splitted[0].replace(/<.*$/, '');
        const id = cleanedPrefix.toLowerCase() + "." + cleanedId;
        return `<a href="#" class="entity-link" data-id="${id}">${cleanedId}</a>`;
      }
      return "";
    });
    return replaced;
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
    if (target.classList.contains('entity-link')) {
      event.preventDefault();
      const id = target.getAttribute('data-id');
      if (id) {
        this.dialog.open(NedrexInfoDialogComponent, {
          data: id,
          width: '720px'
        });
      }
      return;
    }
  }

  onLinkHover(event: MouseEvent): void {
    const refLink = (event.target as HTMLElement).closest('.ref-link');
    if (refLink) {
      const refId = refLink.getAttribute('data-ref');
      if (refId) {
        const paper = this.getPaper(refId);
        if (paper) {
          this.tooltipOverlayRef = this.overlay.create({
            positionStrategy: this.overlay.position()
              .flexibleConnectedTo(refLink)
              .withPositions([{
                originX: 'center',
                originY: 'bottom',
                overlayX: 'center',
                overlayY: 'top'
              }]),
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            hasBackdrop: false,
          });
          const tooltipPortal = new ComponentPortal(PaperOverlayComponent, this.viewContainerRef);
          const tooltipRef = this.tooltipOverlayRef.attach(tooltipPortal);
          tooltipRef.instance.paper = signal(paper);
        }
      }
    }
  }

  onLinkHoverLeave(event: MouseEvent): void {
    if (this.tooltipOverlayRef) {
      this.tooltipOverlayRef.dispose();
      this.tooltipOverlayRef = null;
    }
  }

  getPaper(paperId: string): ToolSourceDTO | undefined {
    if (!paperId) {
      return undefined;
    }
    return this.sources().find(source => source.paperId === paperId);
  }

}
