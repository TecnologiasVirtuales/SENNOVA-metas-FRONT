import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modalidad-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule
  ],
  templateUrl: './modalidad-form.component.html',
  styleUrl: './modalidad-form.component.css'
})
export class ModalidadFormComponent implements OnInit {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef)

  form:FormGroup;

  modalidad?:ModalidadModel;

  constructor(){
    this.form = this. form_builder.group({
      nombre:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5)
      ])
    });
  }

  ngOnInit(): void {
    this.modalidad = this.modal.getConfig().nzData.modalidad;
    if (this.modalidad) {
      const {id} = this.modalidad;
      this.form.addControl('id',new FormControl(id));
      this.field_nombre.setValue(this.modalidad.nombre);
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
}
