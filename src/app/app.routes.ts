import { Route } from '@angular/router';
import { HomeComponent } from './core/pages/home/home.component';
import { authRoutes } from './domain/auth/auth.routes';
import { MainComponent } from './core/layout/main/main.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';

export const routes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'service',
        loadComponent: () => import('./domain/service/pages/service-view/service-view.component').then(c => c.ServiceViewComponent),
      },
      {
        path: 'status',
        loadComponent: () => import('./domain/status/pages/status-view/status-view.component').then(c => c.StatusViewComponent),
      },
      {
        path: 'queue',
        loadComponent: () => import('./domain/queue/pages/queue-view/queue-view.component').then(c => c.QueueViewComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./domain/barbershop/pages/barbershop-view/barbershop-view.component').then(c => c.BarbershopViewComponent),
      },
    ],
  },
  ...authRoutes,
  // ...barbershopRoutes,
  { path: '**', component: NotFoundComponent },
];
