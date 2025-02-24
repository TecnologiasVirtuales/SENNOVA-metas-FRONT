import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaModel } from '@shared/models/meta.model';
import { AuthService } from '@shared/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subscription } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormStyle } from '@shared/style-clases/focus.style';

@Component({
  selector: 'app-metas-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzSpinModule,
    NzDatePickerModule
  ],
  templateUrl: './metas-form.component.html',
  styleUrls: [
    './metas-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]

})
export class MetasFormComponent extends FormStyle implements OnInit, OnDestroy {

  private form_builder = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private auth_service = inject(AuthService);

  usuario = this.auth_service.usuario;

  form:FormGroup;

  meta?:MetaModel;

  data_sub?:Subscription;

  date_range:Date[] = [];

  constructor(){
    super();
    this.form = this.form_builder.group({
      met_codigo:new FormControl(null,[
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(5),
      ]),
      met_fecha_inicio:new FormControl(null,[
        Validators.required,
      ]),
      met_fecha_fin:new FormControl(null,[
        Validators.required,
      ]),
      met_anio:new FormControl(null,[
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(4),
      ]),
      met_total_otras_poblaciones:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_victimas:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_desplazados_violencia:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_hechos_victimizantes:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_titulada:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_complementaria:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      met_total_poblacion_vulnerable:new FormControl(null,[
        Validators.required,
        Validators.min(1),
      ]),
      per_documento:new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.meta = this.modal.getConfig().nzData.meta;
    this.field_per_documento.setValue(this.usuario()!.per_documento);
    if (this.meta) {
      const {
        met_codigo,
        met_fecha_inicio,
        met_fecha_fin,
        met_anio,
        met_total_otras_poblaciones,
        met_total_victimas,
        met_total_desplazados_violencia,
        met_total_hechos_victimizantes,
        met_total_titulada,
        met_total_complementaria,
        met_total_poblacion_vulnerable,
        per_documento
      } = this.meta; 

      this.field_codigo.setValue(met_codigo);
      this.field_fecha_inicio.setValue(met_fecha_inicio);
      this.field_fecha_fin.setValue(met_fecha_fin);
      this.field_anio.setValue(met_anio);
      this.field_total_otras_poblaciones.setValue(met_total_otras_poblaciones);
      this.field_total_victimas.setValue(met_total_victimas);
      this.field_total_desplazados_violencia.setValue(met_total_desplazados_violencia);
      this.field_total_hechos_victimizantes.setValue(met_total_hechos_victimizantes);
      this.field_total_titulada.setValue(met_total_titulada);
      this.field_total_complementaria.setValue(met_total_complementaria);
      this.field_total_poblacion_vulnerable.setValue(met_total_poblacion_vulnerable);
      this.field_per_documento.setValue(per_documento);
    }
  }

  ngOnDestroy(): void {
    this.resetDataSub();
  }

  get field_codigo(){
    return this.form.get('met_codigo') as FormControl<string>;
  }

  get field_fecha_inicio(){
    return this.form.get('met_fecha_inicio') as FormControl<Date>;
  }

  get field_fecha_fin(){
    return this.form.get('met_fecha_fin') as FormControl<Date>;
  }

  get field_anio(){
    return this.form.get('met_anio') as FormControl<string>;
  }

  get field_total_otras_poblaciones(){
    return this.form.get('met_total_otras_poblaciones') as FormControl<string>;
  }

  get field_total_victimas(){
    return this.form.get('met_total_victimas') as FormControl<string>;
  }

  get field_total_desplazados_violencia(){
    return this.form.get('met_total_desplazados_violencia') as FormControl<string>;
  }

  get field_total_hechos_victimizantes(){
    return this.form.get('met_total_hechos_victimizantes') as FormControl<string>;
  }

  get field_total_titulada(){
    return this.form.get('met_total_titulada') as FormControl<string>;
  }

  get field_total_complementaria(){
    return this.form.get('met_total_complementaria') as FormControl<string>;
  }

  get field_total_poblacion_vulnerable(){
    return this.form.get('met_total_poblacion_vulnerable') as FormControl<string>;
  }

  get field_per_documento(){
    return this.form.get('per_documento') as FormControl<number>;
  }

  submitForm(){
    const {value,valid} = this.form;
    if(valid){
      this.modal.close({form:value});
    }
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

}
