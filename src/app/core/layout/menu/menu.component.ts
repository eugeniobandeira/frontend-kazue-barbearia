import { AuthService } from '@/core/services/auth.service';
import { NavigationUtils } from '@/shared/utils/navigation';
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
  providers: [NavigationUtils],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  router = inject(Router);

  private readonly navigationUtils = inject(NavigationUtils);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    const user = this.authService.getUser();
    const role = user?.role;

    this.items = [
      {
        label: 'Home',
        command: () => this.navigationUtils.goHome(),
      },
      {
        icon: 'pi pi-angle-down',
        label: 'Usuário',
        items: [
          {
            label: 'Cadastro',
            command: () => this.navigationUtils.navigateTo('/sign-up'),
          },
          {
            label: 'Login',
            command: () => this.navigationUtils.navigateTo('/login'),
          },
          {
            label: 'Sair',
            command: () => this.authService.logout(),
          },
        ],
      },
      {
        label: 'Fila',
        command: () => this.navigationUtils.navigateTo('/queue'),
      },
      {
        label: 'Sobre',
        command: () => this.navigationUtils.navigateTo('/about'),
      },
    ];

    if (role === 'admin') {
      this.items.push({
        label: 'Admin',
        command: () => this.navigationUtils.navigateTo('/barbershop'),
      });
    }
  }
}
