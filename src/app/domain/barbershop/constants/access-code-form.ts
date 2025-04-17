import { inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

type AccessCodeFormControl = {
  accessCode: FormControl<string>;
  isOpen: FormControl<boolean>;
};

export function createAccessCodeFormControl(): FormGroup<AccessCodeFormControl> {
  const fb = inject(NonNullableFormBuilder);

  return fb.group({
    accessCode: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
      nonNullable: true,
    }),
    isOpen: new FormControl(false, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
}

export type AccessCodeFormGroup = ReturnType<typeof createAccessCodeFormControl>;

export type AccessCodeFormValue = ReturnType<AccessCodeFormGroup['getRawValue']>;
