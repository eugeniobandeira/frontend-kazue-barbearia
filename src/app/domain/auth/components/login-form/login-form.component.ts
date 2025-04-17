import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { createLoginFormControl } from '../../constants/login-form';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { iLogin } from '../../interfaces/request/login.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';
import { LoadingService } from '../../services/loading.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  InputSwitchModule,
  CalendarModule,
  InputMaskModule,
  PasswordModule,
  RouterModule,
];

@Component({
  selector: 'app-login-form',
  imports: [...MODULES],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoginFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);
  private readonly _snackBarService = inject(SnackBarService);
  public readonly _isLoading = inject(LoadingService);

  visible = false;

  public readonly loginForm = createLoginFormControl();

  ngOnInit() {
    this.visible = true;
    this._isLoading.stop();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this._isLoading.start();

    const { email, password } = this.loginForm.getRawValue();

    const req: iLogin = { email, password };

    this._authService
      .login(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: user => {
          this._snackBarService.showSnackBar('Login efetuado com sucesso', 3000, 'center', 'bottom');
          this._isLoading.stop();
        },
        error: err => {
          this._snackBarService.showSnackBar('Credenciais inválidas', 3000, 'center', 'bottom');
          console.error('Erro no login:', err);
        },
      });
  }
}
