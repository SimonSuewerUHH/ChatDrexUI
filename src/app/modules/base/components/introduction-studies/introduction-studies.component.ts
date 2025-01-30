import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';


interface ReviewSummary {
  review: string;
  totalOrig: number;
  totalPrep: number;
  screen1Orig: number;
  screen1Prep: number;
  screen2Orig: number;
  screen2Prep: number;
}

@Component({
  selector: 'app-introduction-studies',
  imports: [MatTableModule],
  templateUrl: './introduction-studies.component.html',
  styleUrl: './introduction-studies.component.scss'
})
export class IntroductionStudiesComponent {
  displayedColumns: string[] = [
    'review',
    'totalOrig',
    'totalPrep',
    'screen1Orig',
    'screen1Prep',
    'screen2Orig',
    'screen2Prep'
  ];

  reviewsData: ReviewSummary[] = [
    {
      review: 'Review I (Physio)',
      totalOrig: 4662,
      totalPrep: 4501,
      screen1Orig: 185,
      screen1Prep: 181,
      screen2Orig: 75,
      screen2Prep: 73
    },
    {
      review: 'Review II (Neuro)',
      totalOrig: 1741,
      totalPrep: 1650,
      screen1Orig: 122,
      screen1Prep: 113,
      screen2Orig: 34,
      screen2Prep: 22
    },
    {
      review: 'Review III (DigiHealth)',
      totalOrig: 66,
      totalPrep: 66,
      screen1Orig: 45,
      screen1Prep: 45,
      screen2Orig: 6,
      screen2Prep: 6
    }
  ];
}
