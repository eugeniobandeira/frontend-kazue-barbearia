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
import { delay, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
})
export class SignUpFormComponent implements OnInit {
  private readonly _userApi = inject(UserApi);
  private readonly _snackBarService = inject(SnackBarService);
  public readonly _isLoading = inject(LoadingService);
  private readonly _destroy$ = inject(DestroyRef);

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

    const req: iUserCreateRequest = {
      fullname: formValue.fullname,
      nicknamePreference: formValue.nicknamePreference,
      nickname: nickname,
      email: formValue.email,
      phone: rawPhone,
      password: formValue.password,
      role: formValue.role,
      dateOfBirth: formValue.dateOfBirth,
    };

    this._userApi
      .create(req)
      .pipe(
        delay(4000),
        finalize(() => this._isLoading.stop()),
        takeUntilDestroyed(this._destroy$)
      )
      .subscribe({
        next: data => {
          this.lista = [data];
        },
        // error: error => {
        //   this._snackBarService.showSnackBar(error?.error?.message, 3000, 'end', 'top');
        //   console.error('Error:', error);
        // },
        complete: () => {
          this._snackBarService.showSnackBar('Usuário cadastrado com sucesso!', 3000, 'center', 'bottom');
          this.signupForm.reset();
          this.onSave.emit();
        },
      });
  }
}
