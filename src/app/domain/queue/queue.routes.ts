import { AuthGuard } from '@/core/guards/auth.guard';
import { Routes } from '@angular/router';

export const queueRoutes: Routes = [
  {
    path: 'queue',
    loadComponent: () => import('./pages/queue-view/queue-view.component').then(c => c.QueueViewComponent),
    canActivate: [AuthGuard],
  },
];
