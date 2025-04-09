import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'service',
    loadChildren: () => import('./pages/service-view/service-view.component').then(c => c.ServiceViewComponent),
  },
];
