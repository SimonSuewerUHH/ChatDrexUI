import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {ToolFileResponseDTO, ToolFileResponseType} from '../../dto/message';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MatIcon} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-file-result-detail',
  imports: [
    MatIcon,
    MatCard,
    MatTooltip,
    MatButton,
    MatDivider,
    MatProgressSpinner,
    MatTableModule
  ],
  templateUrl: './file-result-detail.component.html',
  styleUrl: './file-result-detail.component.scss'
})
export class FileResultDetailComponent {
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  protected readonly ToolFileResponseType = ToolFileResponseType;

  file = input.required<ToolFileResponseDTO>();

  readonly fileType = computed(() => this.file().type);
  readonly filePath = computed(() => this.file().path);
  readonly fileName = computed(() => this.file().name);

  readonly safeUrl: () => SafeResourceUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.filePath())
  );
  readonly isHttpUrl = computed(() =>
    /^https?:\/\//i.test(this.filePath() ?? '')
  );

  readonly csvLoading = signal(false);
  readonly csvError = signal<string | null>(null);
  readonly csvHeaders = signal<string[]>([]);
  readonly csvRows = signal<string[][]>([]);
  readonly displayedColumns = computed(() => this.csvHeaders().map((_, i) => `c${i}`));

  private _csvLoader = effect(async () => {
    if (this.fileType() === ToolFileResponseType.CSV && this.filePath()) {
      await this.loadCsvPreview(this.filePath());
    }
  });

  async loadCsvPreview(path: string, maxRows = 25) {
    this.csvLoading.set(true);
    this.csvError.set(null);
    this.csvHeaders.set([]);
    this.csvRows.set([]);
    try {
      const res = await fetch(path, {cache: 'no-store'});
      if (!res.ok) throw new Error(`HTTP ${res.status} while loading CSV`);
      const text = await res.text();

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        this.csvLoading.set(false);
        return;
      }

      // Auto-detect delimiter from header line; supports ",", ";", or tab.
      const delimiter = this.detectDelimiter(lines[0]);

      let headers = this.splitCsvLine(lines[0], delimiter).map(h => h.trim());

      // If a header cell is empty (e.g., leading comma ",JI-based"), give it a friendly fallback
      headers = headers.map((h, i) => (h === '' ? (i === 0 ? 'Label' : `col${i + 1}`) : h));

      const rawRows = lines.slice(1, 1 + maxRows).map((ln) => this.splitCsvLine(ln, delimiter));

      // Normalize row lengths to header length (pad or trim) and trim cells
      const rows = rawRows.map((r) => {
        const copy = r.slice(0, headers.length).map((c) => c.trim());
        while (copy.length < headers.length) copy.push('');
        return copy;
      });

      debugger;
      this.csvHeaders.set(headers);
      this.csvRows.set(rows);
    } catch (e: any) {
      this.csvError.set(e?.message ?? 'Failed to load CSV preview.');
    } finally {
      this.csvLoading.set(false);
    }
  }

  // Very simple CSV splitter with basic quoted-field support; delimiter can be ",", ";", or "\t".
  private splitCsvLine(line: string, delimiter: string = ','): string[] {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  // Detects the most likely delimiter from the header line.
  private detectDelimiter(headerLine: string): string {
    const candidates = [',', ';', '\t'];
    let best = ',';
    let maxCount = -1;
    for (const d of candidates) {
      const count = headerLine.split(d).length - 1;
      if (count > maxCount) {
        maxCount = count;
        best = d;
      }
    }
    return best;
  }

  openInNewTab() {
    window.open(this.filePath(), '_blank', 'noopener,noreferrer');
  }
}
