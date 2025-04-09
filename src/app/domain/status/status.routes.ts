import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'status',
    loadChildren: () => import('./pages/status-view/status-view.component').then(c => c.StatusViewComponent),
  },
];
