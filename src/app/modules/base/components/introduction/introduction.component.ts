import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-introduction',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.scss'
})
export class IntroductionComponent {

}
