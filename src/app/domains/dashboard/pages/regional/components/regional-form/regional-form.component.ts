import { CommonModule } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
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
export class RegionalFormComponent extends FormStyle {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private departamento_service = inject(DepartamentoService);

  loading_departamentos:boolean = true;;

  form:FormGroup;

  regional?:RegionalModel;
  departamentos:DepartamentoModel[] = [];

  constructor(){
    super();
    this.form = this. form_builder.group({
      nombre:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ]),
      departamento_id: new FormControl(null,[Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  configForm(){
    this.regional = this.modal.getConfig().nzData.modalidad;
    if (this.regional) {
      const {id,nombre,departamento_id} = this.regional;
      this.form.addControl('id',new FormControl(id));
      this.field_departamento.setValue(departamento_id);
      this.field_nombre.setValue(nombre);
    }
    this.loading_departamentos = false;
  }

  loadData(){
    const data_sub = forkJoin([
      this.departamento_service.getAll()
    ]).subscribe({
      next:([departamentos])=>{
        this.departamentos = [...departamentos];
      },
      complete:()=>{
        this.configForm();
        data_sub.unsubscribe()
      },
      error:()=>data_sub.unsubscribe()
    });
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

  get field_departamento(){
    return this.form.get('departamento_id') as FormControl<number>;
  }

}
