import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

const MODULES = [RouterModule, ButtonModule];

@Component({
  selector: 'app-waiting-approval',
  imports: [...MODULES],
  templateUrl: './waiting-approval.component.html',
  styleUrl: './waiting-approval.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingApprovalComponent {
  private readonly _router = inject(Router);

  goHome() {
    this._router.navigate(['/']);
  }

  goLogin() {
    this._router.navigate(['/login']);
  }
}
