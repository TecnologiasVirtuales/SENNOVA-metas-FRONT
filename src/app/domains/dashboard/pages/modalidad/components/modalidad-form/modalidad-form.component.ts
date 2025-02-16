import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { FormStyle } from '@shared/style-clases/focus.style';
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
  styleUrls:[
    './modalidad-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class ModalidadFormComponent extends FormStyle implements OnInit {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);

  form:FormGroup;

  modalidad?:ModalidadModel;

  constructor(){
    super();
    this.form = this. form_builder.group({
      modalidad:new FormControl(null,[
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
      const {id,modalidad: nombre} = this.modalidad;
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
    return this.form.get('modalidad') as FormControl<string>;
  }

}
