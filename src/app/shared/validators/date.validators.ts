import { AbstractControl, ValidationErrors } from '@angular/forms';

export function futureOrTodayDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const selected = new Date(value);
  const today = new Date();

  // remove time portion
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selected < today) {
    return { pastDate: true };
  }
  return null;
}
