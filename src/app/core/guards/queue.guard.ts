import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class QueueGuard implements CanActivate {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this._authService.getUser();
    const token = this._authService.getToken();

    if (user && token && this._authService.isTokenValid(token) && user.id) {
      if (user.status === 'Aprovado') {
        return true;
      } else {
        this._router.navigate(['/waiting-for-approval']);
        return false;
      }
    }

    this._router.navigate(['/login']);
    return false;
  }
}
