import { Routes } from '@angular/router';

export const barbershopRoutes: Routes = [
  {
    path: 'barbershop',
    loadComponent: () => import('./pages/barbershop-view/barbershop-view.component').then(c => c.BarbershopViewComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
  },
  {
    path: 'approval',
    loadComponent: () => import('./components/approval-user/approval-user.component').then(c => c.ApprovalUserComponent),
  },
];
