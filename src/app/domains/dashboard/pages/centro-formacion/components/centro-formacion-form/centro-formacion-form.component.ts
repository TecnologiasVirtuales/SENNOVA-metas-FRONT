import { CommonModule } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { RegionalModel } from '@shared/models/regional.model';
import { RegionalService } from '@shared/services/regional.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-centro-formacion-form',
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
  templateUrl: './centro-formacion-form.component.html',
  styleUrls: [
    './centro-formacion-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class CentroFormacionFormComponent extends FormStyle{

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private regional_service = inject(RegionalService);

  loading_regionales:boolean = true;;

  form:FormGroup;

  centro_formacion?:CentroFormacionModel;
  regionales:RegionalModel[] = [];

  constructor(){
    super();
    this.form = this. form_builder.group({
      nombre:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ]),
      regional_id: new FormControl(null,[Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  configForm(){
    this.centro_formacion = this.modal.getConfig().nzData.centro_formacion;
    if (this.centro_formacion) {
      const {id,nombre,regional_id} = this.centro_formacion;
      this.form.addControl('id',new FormControl(id));
      this.field_regional.setValue(regional_id);
      this.field_nombre.setValue(nombre);
    }
    this.loading_regionales = false;
  }

  loadData(){
    const data_sub = forkJoin([
      this.regional_service.getAll()
    ]).subscribe({
      next:([departamentos])=>{
        this.regionales = [...departamentos];
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

  get field_regional(){
    return this.form.get('regional_id') as FormControl<number>;
  }
}
