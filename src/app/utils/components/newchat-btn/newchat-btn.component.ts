import {Component, inject} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {Store} from '@ngrx/store';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-newchat-btn',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './newchat-btn.component.html',
  styleUrl: './newchat-btn.component.scss'
})
export class NewchatBtnComponent {

}
