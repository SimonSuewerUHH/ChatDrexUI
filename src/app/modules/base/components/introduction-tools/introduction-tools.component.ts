import { Component } from '@angular/core';
import {MatFabAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-introduction-tools',
  imports: [
    MatFabAnchor,
    MatIcon,
    RouterLink
  ],
  templateUrl: './introduction-tools.component.html',
  styleUrl: './introduction-tools.component.scss'
})
export class IntroductionToolsComponent {

}
