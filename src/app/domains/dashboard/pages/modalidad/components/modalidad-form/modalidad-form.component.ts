import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-modalidad-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
  ],
  templateUrl: './modalidad-form.component.html',
  styleUrl: './modalidad-form.component.css'
})
export class ModalidadFormComponent implements OnInit {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private renderer = inject(Renderer2);

  form:FormGroup;

  modalidad?:ModalidadModel;

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
    this.modalidad = this.modal.getConfig().nzData.modalidad;
    if (this.modalidad) {
      const {id,nombre} = this.modalidad;
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
    const control = (event.target as HTMLElement).closest('.modalidad-form_control');
    this.renderer.addClass(control, 'form-control_focus');
  }

  onBlur(event: FocusEvent) {
    const control = (event.target as HTMLElement).closest('.modalidad-form_control');
    this.renderer.removeClass(control, 'form-control_focus');
  }
}
