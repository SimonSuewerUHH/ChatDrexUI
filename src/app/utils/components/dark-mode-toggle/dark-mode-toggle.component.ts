import {Component, effect, OnInit, signal} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dark-mode-toggle',
  imports: [MatSlideToggleModule, FormsModule],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.scss'
})
export class DarkModeToggleComponent  implements OnInit{
  darkMode = signal(false);

  ngOnInit() {
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.darkMode.set(darkModeOn);
  }

  applyDarkMode = effect(() => {
    const darkMode = this.darkMode();
    document.body.classList.toggle('dark-mode', darkMode);
  });
}
