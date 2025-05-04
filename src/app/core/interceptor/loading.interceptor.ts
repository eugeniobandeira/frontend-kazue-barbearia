import { LoadingService } from '@/shared/services/loading.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  loadingService.start();

  return next(req).pipe(
    tap({
      next: () => {},
      error: () => {},
    }),
    finalize(() => loadingService.stop())
  );
};
