import { QueueGuard } from '@/core/guards/queue.guard';
import { Routes } from '@angular/router';

export const queueRoutes: Routes = [
  {
    path: 'queue',
    loadComponent: () => import('./pages/queue-view/queue-view.component').then(c => c.QueueViewComponent),
    canActivate: [QueueGuard],
  },
];
