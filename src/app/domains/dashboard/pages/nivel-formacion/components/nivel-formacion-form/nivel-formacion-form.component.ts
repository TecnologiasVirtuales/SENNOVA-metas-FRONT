import { CommonModule } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-nivel-formacion-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
  ],
  templateUrl: './nivel-formacion-form.component.html',
  styleUrl: './nivel-formacion-form.component.css'
})
export class NivelFormacionFormComponent {
  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private renderer = inject(Renderer2);

  form:FormGroup;

  nivel_formacion?:NivelFormacionModel;

  constructor(){
    this.form = this. form_builder.group({
      nombre:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ])
    });
  }

  ngOnInit(): void {
    this.nivel_formacion = this.modal.getConfig().nzData.modalidad;
    if (this.nivel_formacion) {
      const {id,nombre} = this.nivel_formacion;
      this.form.addControl('id',new FormControl(id));
      this.field_nombre.setValue(nombre);
    }
  }

  submitForm(){    
    if(this.form.valid){
      const {value} = this.form;
      this.modal.close({form:value});
    }
  }

  get field_nombre(){
    return this.form.get('nombre') as FormControl<string>;
  }

  onFocus(event:FocusEvent){
    const control = (event.target as HTMLElement).closest('.nivel-form_control');
    this.renderer.addClass(control, 'form-control_focus');
  }

  onBlur(event: FocusEvent) {
    const control = (event.target as HTMLElement).closest('.nivel-form_control');
    this.renderer.removeClass(control, 'form-control_focus');
  }
}
