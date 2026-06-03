import {ChangeDetectionStrategy, Component, computed, effect, input, signal} from '@angular/core';
import {ToolFileResponseDTO, ToolFileResponseType} from '../../dto/message';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FileResultDetailComponent} from '../file-result-detail/file-result-detail.component';

@Component({
  selector: 'app-file-result-list',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FileResultDetailComponent,
  ],
  templateUrl: './file-result-list.component.html',
  styleUrl: './file-result-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileResultListComponent {
  files = input.required<ToolFileResponseDTO[]>();

  readonly selectedIndex = signal(0);
  readonly selectedFile = computed<ToolFileResponseDTO | undefined>(
    () => this.files()[this.selectedIndex()],
  );

  // Reset selection if the file list shrinks past the current index.
  private _clampIndex = effect(() => {
    const len = this.files().length;
    if (len === 0) {
      this.selectedIndex.set(0);
      return;
    }
    if (this.selectedIndex() >= len) {
      this.selectedIndex.set(0);
    }
  });

  select(i: number): void {
    this.selectedIndex.set(i);
  }

  iconFor(type: ToolFileResponseType): string {
    switch (type) {
      case ToolFileResponseType.CSV:
        return 'table_view';
      case ToolFileResponseType.PNG:
        return 'image';
      case ToolFileResponseType.URL:
        return 'link';
      case ToolFileResponseType.DOWNLOAD:
        return 'download';
      case ToolFileResponseType.IFRAME:
        return 'open_in_new';
      default:
        return 'description';
    }
  }
}
