import { RolesGuard } from '@/core/guards/roles.guard';
import { Routes } from '@angular/router';

export const serviceRoutes: Routes = [
  {
    path: 'services',
    loadComponent: () => import('./pages/service-view/service-view.component').then(c => c.ServiceViewComponent),
    canActivate: [RolesGuard],
    // data: { roles: ['admin'] },
  },
];
