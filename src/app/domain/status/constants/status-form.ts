import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type StatusFormControl = {
  code: FormControl<string>;
  description: FormControl<string>;
  domain: FormControl<string>;
};

export function createStatusFormControl(): FormGroup<StatusFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    code: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(3)],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    domain: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
}

export type StatusFormGroup = ReturnType<typeof createStatusFormControl>;

export type StatusFormValue = ReturnType<StatusFormGroup['getRawValue']>;
