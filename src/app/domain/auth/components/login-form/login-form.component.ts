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
import { RouterModule } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { MessageService } from 'primeng/api';
import { NavigationUtils } from '@/shared/utils/navigation';
import { LoadingService } from '@/shared/services/loading.service';

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
  providers: [MessageService, NavigationUtils],
})
export class LoginFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);
  public readonly loadingService = inject(LoadingService);
  private readonly _messageService = inject(MessageService);
  private readonly _navigationUtils = inject(NavigationUtils);

  visible = false;

  public readonly loginForm = createLoginFormControl();

  ngOnInit() {
    this.visible = true;
    // this._isLoading.stop();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.getRawValue();
    const req: iLogin = { username, password };

    this._authService
      .login(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: user => {
          this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Login efetuado com sucesso!',
            life: 3000,
          });

          this._navigationUtils.goHome();
        },
        error: err => {
          this._messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Credenciais inválidas',
            life: 3000,
          });
          console.error('Erro no login:', err);
        },
      });
  }
}
