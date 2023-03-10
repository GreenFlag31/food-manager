import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const date = new Date();
const dateWithoutCurrentHour = new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  1
);

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return new Date(control.value) < dateWithoutCurrentHour
      ? { invalidDate: { value: control.value } }
      : null;
  };
}
