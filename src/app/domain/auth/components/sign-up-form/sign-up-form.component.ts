import { UserApi } from '@/domain/user/apis/user.api';
import { SnackBarService } from '@/shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
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
import { LoadingService } from '@/shared/services/loading.service';

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
  public readonly loadingService = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);
  private readonly _messageService = inject(MessageService);
  private readonly router = inject(Router);

  @Output() onSave = new EventEmitter<void>();

  public readonly signupForm = createUserSignUpFormControl();

  lista: any[] = [];
  showCalendar = false;
  maxDate = new Date();

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
    const formValue = this.signupForm.getRawValue();

    const rawPhone = formValue.phone?.replace(/\D/g, '') || '';

    const nickname = formValue.nicknamePreference ? formValue.nickname : null;

    const req: iUserCreateRequest = {
      fullname: formValue.fullname,
      nicknamePreference: formValue.nicknamePreference,
      nickname: nickname,
      username: formValue.username,
      phone: rawPhone,
      password: formValue.password,
      role: formValue.role,
      dateOfBirth: formValue.dateOfBirth,
    };

    this._userApi
      .create(req)
      .pipe(takeUntilDestroyed(this._destroy$))
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
