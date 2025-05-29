import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { iUserRegisteredResponse } from '@domain/user/interfaces/user.interface';
import { iLoginRequest } from '@/domain/auth/interfaces/request/login.interface';
import { jwtDecode } from 'jwt-decode';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _storage = inject(StorageService);
  private readonly _API_URL = environment.apiUrl + '/login';

  private readonly userSig = signal<iUserRegisteredResponse | null>(null);
  public user = this.userSig.asReadonly();

  constructor() {
    this.initializeAuthState();

    effect(() => {
      const user = this.userSig();
      if (user) {
        this._storage.set('auth', user);
      } else {
        this._storage.remove('auth');
      }
    });
  }

  getToken(): string | null {
    return this.getUser()?.token ?? null;
  }

  getUser(): iUserRegisteredResponse | null {
    return this.userSig() ?? this._storage.get<iUserRegisteredResponse>('auth');
  }

  private initializeAuthState(): void {
    const savedUser = this._storage.get<iUserRegisteredResponse>('auth');
    if (savedUser && this.isTokenValid(savedUser.token)) {
      this.userSig.set(savedUser);
    }
  }

  login(credentials: iLoginRequest): Observable<iUserRegisteredResponse> {
    return this._http.post<iUserRegisteredResponse>(this._API_URL, credentials).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleLoginSuccess(response: iUserRegisteredResponse): void {
    this.userSig.set(response);
    this._router.navigate(['/queue']);
  }

  private handleAuthError(error: any): Observable<never> {
    this.clearAuthState();
    return throwError(() => error);
  }

  logout(): void {
    this.clearAuthState();
    this._router.navigate(['/login']);
  }

  private clearAuthState(): void {
    this.userSig.set(null);
    this._storage.remove('auth');
  }

  public isTokenValid(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }
}
