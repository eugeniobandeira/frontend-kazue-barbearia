import { eRoles } from '@/shared/enums/roles.enum';
import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type UserFormControl = {
  fullname: FormControl<string>;
  nicknamePreference: FormControl<boolean>;
  nickname: FormControl<string | null>;
  username: FormControl<string>;
  phone: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<eRoles>;
  dateOfBirth: FormControl<Date | null>;
};

export function createUserSignUpFormControl(): FormGroup<UserFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    fullname: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    nickname: new FormControl('', {
      nonNullable: false,
    }),
    nicknamePreference: new FormControl(false, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    username: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^\S*$/)],
      nonNullable: true,
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    role: new FormControl(eRoles.USER, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    dateOfBirth: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
  });
}

export type UserFormGroup = ReturnType<typeof createUserSignUpFormControl>;

export type UserFormValue = ReturnType<UserFormGroup['getRawValue']>;
