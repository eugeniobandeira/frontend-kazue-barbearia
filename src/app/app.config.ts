import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';

import { routes } from './app.routes';
import { THEME_INITIALIZER_PROVIDER } from './initializer/theme-initializer';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          colorScheme: 'light',
        },
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    THEME_INITIALIZER_PROVIDER,
  ],
};
