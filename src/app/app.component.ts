import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

const MODULES = [RouterModule];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...MODULES],
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}
