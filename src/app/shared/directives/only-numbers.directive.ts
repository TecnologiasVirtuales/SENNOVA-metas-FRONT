import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const teclaPresionada = event.key;

    // Permitir teclas especiales como Backspace, Tab, Enter, etc.
    const teclasEspeciales = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (teclasEspeciales.includes(teclaPresionada)) {
      return;
    }

    // Permitir solo dígitos del 0 al 9
    const esNumero = /\D/g.test(teclaPresionada);
    if (esNumero) {
      event.preventDefault();
    }
  }


  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const soloNumeros = clipboardData.replace(/\D/g, '');    
    document.execCommand('insertText', false, soloNumeros);
  }

}
