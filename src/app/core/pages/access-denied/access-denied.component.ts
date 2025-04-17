import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

const MODULES = [RouterModule, ButtonModule];

@Component({
  selector: 'app-access-denied',
  imports: [...MODULES],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
