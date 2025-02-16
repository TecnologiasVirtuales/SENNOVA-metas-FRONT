import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentoModel } from '@shared/models/departamento.model';
import { RegionalModel } from '@shared/models/regional.model';
import { DepartamentoService } from '@shared/services/departamento.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-regional-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
    NzSelectModule
  ],
  templateUrl: './regional-form.component.html',
  styleUrls: [
    './regional-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class RegionalFormComponent extends FormStyle implements OnInit {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);

  form:FormGroup;

  regional?:RegionalModel;

  constructor(){
    super();
    this.form = this. form_builder.group({
      regional:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ]),
    });
  }

  ngOnInit(): void {
    this.configForm();
  }

  configForm(){
    this.regional = this.modal.getConfig().nzData.regional;
    if (this.regional) {
      const {id,regional: nombre} = this.regional;
      this.form.addControl('id',new FormControl(id));
      this.field_nombre.setValue(nombre);
    }
  }

  submitForm(){    
    if(this.form.valid){
      this.field_nombre.setValue(this.field_nombre.value.toUpperCase());
      const {value} = this.form;
      this.modal.close({form:value});
    }
  }

  get field_nombre(){
    return this.form.get('regional') as FormControl<string>;
  }


}
