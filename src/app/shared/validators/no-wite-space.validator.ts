import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noWhiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const {value} = control;
        let text:string = value ? value as string : '';
        const is_white_space = text.trim().length === 0;
        return is_white_space ? {'whitespace':true} : null;
    }
}