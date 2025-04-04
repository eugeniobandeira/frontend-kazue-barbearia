import { HeroComponent } from '@/core/layout/main/components/hero/hero.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

const COMPONENTS = [HeroComponent];

@Component({
  selector: 'app-home',
  imports: [...COMPONENTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
