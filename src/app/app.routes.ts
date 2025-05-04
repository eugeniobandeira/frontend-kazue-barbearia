import { Route } from '@angular/router';
import { authRoutes } from './domain/auth/auth.routes';
import { barbershopRoutes } from './domain/barbershop/barbershop.routes';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { queueRoutes } from './domain/queue/queue.routes';
import { serviceRoutes } from './domain/service/service.routes';
import { statusRoutes } from './domain/status/status.routes';
import { AccessDeniedComponent } from './core/pages/access-denied/access-denied.component';
import { WaitingApprovalComponent } from './core/pages/waiting-approval/waiting-approval.component';

export const routes: Route[] = [
  {
    ...authRoutes,
    path: '',
    loadComponent: () => import('./core/layout/main/main.component').then(m => m.MainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent),
      },
      ...authRoutes,
      ...barbershopRoutes,
      ...queueRoutes,
      ...serviceRoutes,
      ...statusRoutes,
    ],
  },
  {
    path: 'forbidden',
    component: AccessDeniedComponent,
  },
  {
    path: 'waiting-for-approval',
    component: WaitingApprovalComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
