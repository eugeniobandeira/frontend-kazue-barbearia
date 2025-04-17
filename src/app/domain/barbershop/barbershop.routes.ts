import { Routes } from '@angular/router';

export const barbershopRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./pages/barbershop-view/barbershop-view.component').then(c => c.BarbershopViewComponent),
  },
];
