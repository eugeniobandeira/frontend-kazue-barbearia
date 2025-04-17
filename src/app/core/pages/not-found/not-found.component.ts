import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

const MODULES = [RouterModule, ButtonModule];

@Component({
  selector: 'app-not-found',
  imports: [...MODULES],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
