import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getUser();
    const token = this.authService.getToken();

    if (user && token && this.authService.isTokenValid(token) && user.id) {
      if (user.status === 'Aprovado') {
        return true;
      } else {
        this.router.navigate(['/waiting-for-approval']);
        return false;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
