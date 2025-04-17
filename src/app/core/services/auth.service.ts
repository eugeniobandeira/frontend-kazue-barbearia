import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { iUserRegisteredResponse } from '@domain/user/interfaces/user.interface';
import { iLogin } from '@/domain/auth/interfaces/request/login.interface';
import { jwtDecode } from 'jwt-decode';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly API_URL = environment.apiUrl + '/login';

  private readonly userSig = signal<iUserRegisteredResponse | null>(null);
  public user = this.userSig.asReadonly();

  constructor() {
    this.initializeAuthState();

    effect(() => {
      const user = this.userSig();
      if (user) {
        this.storage.set('auth', user);
      } else {
        this.storage.remove('auth');
      }
    });
  }

  getToken(): string | null {
    return this.user()?.token ?? null;
  }

  getUser(): iUserRegisteredResponse | null {
    return this.user();
  }

  private initializeAuthState(): void {
    const savedUser = this.storage.get<iUserRegisteredResponse>('auth');
    if (savedUser && this.isTokenValid(savedUser.token)) {
      this.userSig.set(savedUser);
    }
  }

  login(credentials: iLogin): Observable<iUserRegisteredResponse> {
    return this.http.post<iUserRegisteredResponse>(this.API_URL, credentials).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleLoginSuccess(response: iUserRegisteredResponse): void {
    this.userSig.set(response);
    this.router.navigate(['/queue']);
    this.notification.showSuccess('AUTH.SUCCESS.LOGIN');
  }

  private handleAuthError(error: any): Observable<never> {
    this.notification.showError('AUTH.ERRORS.LOGIN_FAILED');
    this.clearAuthState();
    return throwError(() => error);
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  private clearAuthState(): void {
    this.userSig.set(null);
    this.storage.remove('auth');
  }

  private isTokenValid(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }
}
