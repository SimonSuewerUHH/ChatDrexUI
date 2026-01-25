import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {IntroductionToolsComponent} from '../introduction-tools/introduction-tools.component';
import {FaqComponent} from '../faq/faq.component';

@Component({
  selector: 'app-introduction',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, IntroductionToolsComponent, FaqComponent],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.scss'
})
export class IntroductionComponent {

}
