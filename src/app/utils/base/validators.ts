import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function doiValidator(): ValidatorFn {
  const DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = DOI_REGEX.test(control.value);
    return valid ? null : {invalidDOI: {value: control.value}};
  };
}

export function yearValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const year = parseInt(control.value, 10);
    const currentYear = new Date().getFullYear();
    const valid = !isNaN(year) && year > 0 && year <= currentYear;
    return valid ? null : {invalidYear: {value: control.value}};
  };
}
