import { inject } from '@angular/core';
import { Router } from '@angular/router';

export class NavigationUtils {
  private readonly router = inject(Router);

  public goHome() {
    this.router.navigate(['/']);
  }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
