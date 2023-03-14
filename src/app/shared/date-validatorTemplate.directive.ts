import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

const date = new Date();
const dateWithoutCurrentHour = new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  1
);

@Directive({
  selector: '[validateTempDate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateValidatorDirective,
      multi: true,
    },
  ],
})
export class DateValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return new Date(control.value) < dateWithoutCurrentHour
      ? { invalidDate: { value: control.value } }
      : null;
  }
}
