import { Route } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';

export const routes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'service',
    loadComponent: () => import('./domain/service/pages/service-view/service-view.component').then(c => c.ServiceViewComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
