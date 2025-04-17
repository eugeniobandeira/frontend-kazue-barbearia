import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { iLogin } from '../interfaces/request/login.interface';
import { iUserRegisteredResponse } from '@/domain/user/interfaces/user.interface';
import { Observable, finalize, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginApi {
  private readonly API_URL = environment.apiUrl + '/login';
  private readonly _httpClient = inject(HttpClient);

  public isLoading = signal(false);

  public login(req: iLogin): Observable<iUserRegisteredResponse> {
    this.isLoading.set(true);

    return this._httpClient.post<iUserRegisteredResponse>(this.API_URL, req).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(error => {
        console.error('Erro no login', error);
        return throwError(() => error);
      })
    );
  }
}
