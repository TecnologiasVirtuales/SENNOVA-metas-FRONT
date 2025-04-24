import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    console.log(password === password2);
    
    return password === password2 ? null : { passwordsMismatch: true };
};

export const passwordChartsValidators = {
    hasUppercase: (): ValidatorFn => control => {
      return /[A-Z]/.test(control.value) ? null : { hasUppercase: true };
    },
    hasSpecialChar: (): ValidatorFn => control => {
      return /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?`~\\]/.test(control.value) ? null : { hasSpecialChar: true };
    },
    hasDigit: (): ValidatorFn => control => {
      return /\d/.test(control.value) ? null : { hasDigit: true };
    }
  };