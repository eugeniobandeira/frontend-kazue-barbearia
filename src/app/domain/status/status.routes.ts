import { RolesGuard } from '@/core/guards/roles.guard';
import { Routes } from '@angular/router';

export const statusRoutes: Routes = [
  {
    path: 'status',
    loadComponent: () => import('./pages/status-view/status-view.component').then(c => c.StatusViewComponent),
    canActivate: [RolesGuard],
    data: { roles: ['admin'] },
  },
];
