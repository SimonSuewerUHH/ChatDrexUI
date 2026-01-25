import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatDivider} from '@angular/material/list';
import {MatDialog} from '@angular/material/dialog';
import {DisclaimerDialogComponent} from '../disclaimer-dialog/disclaimer-dialog.component';
import {NgOptimizedImage} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-start-page',
  imports: [
    MatCardContent,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatButton,
    MatChipSet,
    MatChip,
    MatDivider,
    NgOptimizedImage
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageComponent {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly dialog: MatDialog = inject(MatDialog);
  readonly year = new Date().getFullYear();
  readonly disclaimerAccepted = signal(false);

  readonly examplePrompts = signal<string[]>([
    'What drugs are prioritized for PAH associated with a Bone Morphogenetic Protein Receptor Type 2 mutation?',
    'What drugs are mechanistically linked to pulmonary arterial hypertension involving BMPR2 signaling?',
    'I have long QT syndrome, what drugs should I avoid?',
    'Which drugs may increase the risk of torsade de pointes?',
    'What adverse reactions are reported for Clozapine?'
  ]);

  openDisclaimer(): void {
    this.dialog
      .open(DisclaimerDialogComponent, {
        width: 'min(760px, 92vw)',
        disableClose: false, // like dismissableMask
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (accepted) {
          this.acceptDisclaimer();
        }
      });
  }

  acceptDisclaimer(): void {
    this.disclaimerAccepted.set(true);
  }

  async useExample(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);

      this.snackBar.open('Copied to clipboard', 'OK', {
        duration: 2200,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

    } catch (e) {
      this.snackBar.open('Copy failed. Please copy manually.', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
