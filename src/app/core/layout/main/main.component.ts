import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

const COMPONENTS = [FooterComponent, MenuComponent];
const MODULES = [RouterModule];

@Component({
  selector: 'app-main',
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
})
export class MainComponent {}
