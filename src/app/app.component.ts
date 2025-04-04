import { Component } from '@angular/core';
import { MainComponent } from './core/layout/main/main.component';

const COMPONENTS = [MainComponent];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...COMPONENTS],
  template: `
    <div class="relative min-h-screen w-full">
      <app-main />
    </div>
  `,
})
export class AppComponent {}
