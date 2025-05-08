import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validateDate(formGroup: AbstractControl): ValidationErrors | null {
    const fechaInicio = formGroup.get('met_fecha_inicio')?.value;
    const fechaFin = formGroup.get('met_fecha_fin')?.value;
  
    if (!fechaInicio || !fechaFin) return null;
  
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
  
    if (fin <= inicio) {
      return { invalidDate: true };
    }
    return null;
}