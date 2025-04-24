import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type LoginFormControl = {
  username: FormControl<string>;
  password: FormControl<string>;
};

export function createLoginFormControl(): FormGroup<LoginFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    username: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
}

export type LoginFormGroup = ReturnType<typeof createLoginFormControl>;

export type LoginFormValue = ReturnType<LoginFormGroup['getRawValue']>;
