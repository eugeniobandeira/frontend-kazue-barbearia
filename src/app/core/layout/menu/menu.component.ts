import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

const MODULES = [MenubarModule, RouterModule, CommonModule];

@Component({
  selector: 'app-menu',
  imports: [...MODULES],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.items = [
      {
        label: 'Router',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Installation',
            route: '/installation',
          },
          {
            label: 'Configuration',
            route: '/configuration',
          },
        ],
      },
      {
        label: 'Programmatic',
        icon: 'pi pi-link',
        command: () => {
          this.router.navigate(['/installation']);
        },
      },
      {
        label: 'External',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Angular',
            url: 'https://angular.io/',
          },
          {
            label: 'Vite.js',
            url: 'https://vitejs.dev/',
          },
        ],
      },
    ];
  }
}
