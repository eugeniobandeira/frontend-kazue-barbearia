import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { HeroComponent } from './components/hero/hero.component';

const COMPONENTS = [FooterComponent, MenuComponent, HeroComponent];
const MODULES = [RouterModule];

@Component({
  selector: 'app-main',
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
})
export class MainComponent {}
