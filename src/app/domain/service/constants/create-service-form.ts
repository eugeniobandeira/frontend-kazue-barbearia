import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type ServiceFormControl = {
  code: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
};

export function createServiceFormControl(): FormGroup<ServiceFormControl> {
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
    price: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  });
}

export type ServiceFormGroup = ReturnType<typeof createServiceFormControl>;

export type TaskFormValue = ReturnType<ServiceFormGroup['getRawValue']>;
