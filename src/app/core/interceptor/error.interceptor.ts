// error.interceptor.ts
import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const notificationService = injector.get(NotificationService);
      const authService = injector.get(AuthService);
      const router = injector.get(Router);

      switch (error.status) {
        case 0:
          notificationService.showError('ERRORS.NETWORK');
          break;
        case 401:
          authService.logout();
          router.navigate(['/login'], {
            state: { error: 'ERRORS.SESSION_EXPIRED' },
          });
          break;
        case 403:
          router.navigate(['/error/403'], { replaceUrl: true });
          break;
        default:
          const message = error.error?.message ?? 'ERRORS.GENERIC';
          notificationService.showError(message);
      }
      return throwError(() => error);
    })
  );
};
