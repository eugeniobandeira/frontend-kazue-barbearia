import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

const MODULES = [ButtonModule];

@Component({
  selector: 'app-hero',
  imports: [...MODULES],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeroComponent {}
