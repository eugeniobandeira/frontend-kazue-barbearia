import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type QueueManagerFormControl = {
  idCustomer: FormControl<string>;
  idBarber: FormControl<string>;
  idServices: FormControl<string[]>;
  idStatus: FormControl<number>;
  amount: FormControl<number>;
};

export function createQueueManagerFormControl(): FormGroup<QueueManagerFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    idCustomer: new FormControl('', {
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
    idStatus: new FormControl(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    amount: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  });
}

export type QueueManagerFormGroup = ReturnType<typeof createQueueManagerFormControl>;

export type QueueManagerFormValue = ReturnType<QueueManagerFormGroup['getRawValue']>;
