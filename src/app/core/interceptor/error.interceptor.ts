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
          notificationService.showError('Erro de conexão.');
          break;
        case 401:
          authService.logout();
          router.navigate(['/login'], {
            state: { error: 'Sessão expirada, faça login novamente' },
          });
          break;
        case 403:
          router.navigate(['/error/403'], { replaceUrl: true });
          break;

        default: {
          let message = 'Erro: ';
          const err = error.error;

          if (Array.isArray(err?.errorMessage)) {
            message = err.errorMessage.join(', ');
          } else if (typeof err?.errorMessage === 'string') {
            message = err.errorMessage;
          } else if (err?.message) {
            message = err.message;
          }

          notificationService.showError(message);
        }
      }
      return throwError(() => error);
    })
  );
};
