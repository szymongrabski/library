import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const controlDate = new Date(control.value);

    if (controlDate >= currentDate) {
        return { pastDate: true };
    }
    return null; 
  };
}
