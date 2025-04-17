import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-home',
        route: '/home',
      },
      {
        icon: 'pi pi-user',
        items: [
          {
            label: 'Cadastro',
            route: '/sign-up',
          },
          {
            label: 'Login',
            route: '/login',
          },
        ],
      },
    ];
  }
}
