import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type QueueFormControl = {
  // idCustomer: FormControl<string>;
  idBarber: FormControl<string>;
  validationCode: FormControl<string>;
  idServices: FormControl<string[]>;
  amount: FormControl<number>;
};

export function createQueueFormControl(): FormGroup<QueueFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    validationCode: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    idBarber: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    idServices: new FormControl<string[]>([], {
      validators: [Validators.required],
      nonNullable: true,
    }),
    amount: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  });
}

export type QueueFormGroup = ReturnType<typeof createQueueFormControl>;

export type QueueFormValue = ReturnType<QueueFormGroup['getRawValue']>;
