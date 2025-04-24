import { RolesGuard } from '@/core/guards/roles.guard';
import { Routes } from '@angular/router';

export const barbershopRoutes: Routes = [
  {
    path: 'barbershop',
    loadComponent: () => import('./pages/barbershop-view/barbershop-view.component').then(c => c.BarbershopViewComponent),
    // canActivate: [RolesGuard],
    // data: { roles: ['admin'] },
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
  },
  {
    path: 'approval',
    canActivate: [RolesGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./components/approval-user/approval-user.component').then(c => c.ApprovalUserComponent),
  },
];
