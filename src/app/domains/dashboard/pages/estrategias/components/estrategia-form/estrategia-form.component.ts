import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { FormStyle } from '@shared/style-clases/focus.style';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-estrategia-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
  ],
  templateUrl: './estrategia-form.component.html',
  styleUrls: [
    './estrategia-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class EstrategiaFormComponent extends FormStyle implements OnInit{
  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);

  form:FormGroup;

  estrategia?:EstrategiaModel;

  constructor(){
    super();
    this.form = this.form_builder.group({
      est_nombre:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ])
    });
  }

  get field_nombre(){
    return this.form.get('est_nombre') as FormControl<string>;
  }

  ngOnInit(): void {
    let {nzData} = this.modal.getConfig();
    let {estrategia} = nzData;
    this.estrategia = estrategia;
    if(this.estrategia){
      const {
        est_nombre
      } = this.estrategia;
      this.field_nombre.setValue(est_nombre);
    }
  }

  submitForm(){   
    if(this.form.valid){
      let {value:nombre} = this.field_nombre;
      this.field_nombre.setValue(nombre.toUpperCase());
      const {value} = this.form;
      this.modal.close({form:value});
    }
  }
}
