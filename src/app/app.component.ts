import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

const MODULES = [RouterModule];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...MODULES],
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Verifica o modo do sistema e aplica a classe 'dark' no html
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', darkMode);

    // Opcional: Observa mudanças no modo do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      document.documentElement.classList.toggle('dark', e.matches);
    });
  }
}
