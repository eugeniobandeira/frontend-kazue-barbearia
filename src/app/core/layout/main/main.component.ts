import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

const COMPONENTS = [HeaderComponent, FooterComponent, SidebarComponent, MenuComponent];
const MODULES = [RouterModule];

@Component({
  selector: 'app-main',
  imports: [...COMPONENTS, ...MODULES],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
})
export class MainComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
