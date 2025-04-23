// import { Route } from '@angular/router';
// import { HomeComponent } from './core/pages/home/home.component';
// import { authRoutes } from './domain/auth/auth.routes';
// import { MainComponent } from './core/layout/main/main.component';
// import { NotFoundComponent } from './core/pages/not-found/not-found.component';

// export const routes: Route[] = [
//   {
//     path: '',
//     component: MainComponent,
//     children: [
//       {
//         path: 'home',
//         component: HomeComponent,
//       },
//       {
//         path: 'service',
//         loadComponent: () => import('./domain/service/pages/service-view/service-view.component').then(c => c.ServiceViewComponent),
//       },
//       {
//         path: 'status',
//         loadComponent: () => import('./domain/status/pages/status-view/status-view.component').then(c => c.StatusViewComponent),
//       },
//       {
//         path: 'queue',
//         loadComponent: () => import('./domain/queue/pages/queue-view/queue-view.component').then(c => c.QueueViewComponent),
//       },
//       {
//         path: 'admin',
//         loadComponent: () => import('./domain/barbershop/pages/barbershop-view/barbershop-view.component').then(c => c.BarbershopViewComponent),
//       },
//       {
//         path: 'approval',
//         loadComponent: () => import('./domain/barbershop/components/approval-user/approval-user.component').then(c => c.ApprovalUserComponent),
//       },
//       {
//         path: 'about',
//         loadComponent: () => import('./domain/barbershop/components/about/about.component').then(c => c.AboutComponent),
//       },
//     ],
//   },
//   ...authRoutes,
//   // ...barbershopRoutes,
//   { path: '**', component: NotFoundComponent },
// ];

import { Route } from '@angular/router';
import { authRoutes } from './domain/auth/auth.routes';
import { barbershopRoutes } from './domain/barbershop/barbershop.routes';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { queueRoutes } from './domain/queue/queue.routes';
import { serviceRoutes } from './domain/service/service.routes';
import { statusRoutes } from './domain/status/status.routes';

export const routes: Route[] = [
  {
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
    path: '**',
    component: NotFoundComponent,
  },
];
