import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRoles = next.data['roles'] as Array<string>;

    const user = this._authService.getUser();
    const userRole = user ? user.role : null;

    if (user && userRole && requiredRoles.includes(userRole)) {
      return true;
    } else {
      this._router.navigate(['/forbidden']);
      return false;
    }
  }
}
