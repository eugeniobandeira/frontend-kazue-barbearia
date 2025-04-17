import { LoadingService } from '@/domain/auth/services/loading.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  loadingService.start();

  return next(req).pipe(
    tap({
      finalize: () => loadingService.stop(),
    })
  );
};
