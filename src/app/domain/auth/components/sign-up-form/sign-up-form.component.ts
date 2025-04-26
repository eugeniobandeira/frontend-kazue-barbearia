import { UserApi } from '@/domain/user/apis/user.api';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '../../services/loading.service';
import { iUserCreateRequest } from '@/domain/user/interfaces/user.interface';
import { createUserSignUpFormControl } from '../../constants/sign-up-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

const MODULES = [
  CommonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  CalendarModule,
  PasswordModule,
  DropdownModule,
  InputMaskModule,
  InputSwitchModule,
  DividerModule,
  CardModule,
  RouterModule,
  TranslateModule,
];

@Component({
  selector: 'app-sign-up-form',
  imports: [...MODULES],
  standalone: true,
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class SignUpFormComponent implements OnInit {
  private readonly _userApi = inject(UserApi);
  private readonly _snackBarService = inject(SnackBarService);
  public readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);
  private readonly _messageService = inject(MessageService);
  private readonly router = inject(Router);

  @Output() onSave = new EventEmitter<void>();

  public readonly signupForm = createUserSignUpFormControl();

  lista: any[] = [];
  showCalendar = false;

  ngOnInit() {
    this.setupNicknameValidation();
  }

  private setupNicknameValidation() {
    const nicknameControl = this.signupForm.get('nickname');
    const nicknamePreferenceControl = this.signupForm.get('nicknamePreference');

    nicknamePreferenceControl?.valueChanges.subscribe(useNickname => {
      if (useNickname) {
        nicknameControl?.setValidators([Validators.required]);
      } else {
        nicknameControl?.clearValidators();
        nicknameControl?.setValue(null);
      }
      nicknameControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    this._isLoading.start();

    const formValue = this.signupForm.getRawValue();

    const rawPhone = formValue.phone?.replace(/\D/g, '') || '';

    const nickname = formValue.nicknamePreference ? formValue.nickname : null;

    const formattedDate = formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString().split('T')[0] : null;

    const req: iUserCreateRequest = {
      fullname: formValue.fullname,
      nicknamePreference: formValue.nicknamePreference,
      nickname: nickname,
      username: formValue.username,
      phone: rawPhone,
      password: formValue.password,
      role: formValue.role,
      dateOfBirth: formattedDate,
    };

    this._userApi
      .create(req)
      .pipe(
        finalize(() => this._isLoading.stop()),
        takeUntilDestroyed(this._destroy$)
      )
      .subscribe({
        next: data => {
          this.lista = [data];
        },
        error: error => {
          this._messageService.add({
            severity: 'danger',
            summary: 'Erro',
            detail: 'Erro ao cadastrar usuário',
            life: 3000,
          });
          console.error('Error:', error);
        },
        complete: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro efetuado com sucesso!',
            life: 3000,
          });
          this.signupForm.reset();
          this.onSave.emit();
          this.router.navigate(['/login']);
        },
      });
  }
}
