import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subscription, debounceTime, forkJoin, skip } from 'rxjs';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { MetaModel } from '@shared/models/meta.model';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { MetasService } from '@shared/services/metas.service';
import { ModalidadService } from '@shared/services/modalidad.service';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-metas-formacion-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
    NzSelectModule,
    NzSpinModule
  ],
  templateUrl: './metas-formacion-form.component.html',
  styleUrls: [
    './metas-formacion-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class MetasFormacionFormComponent extends FormStyle implements OnInit, OnDestroy {
  
  private form_builder = inject(FormBuilder);
  private modalidad_service = inject(ModalidadService);
  private meta_service = inject(MetasService);
  private centro_service = inject(CentroFormacionService);
  private modal = inject(NzModalRef);

  form:FormGroup;

  meta_formacion?:MetaFormacionModel;

  metas:MetaModel[] = [];
  is_loading_meta:boolean = true;
  page_meta:number = 1;
  num_meta:number = 10;
  search_meta:string = '';
  search_meta_sub?:Subscription;
  search_meta_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  modalidades:ModalidadModel[] = [];
  is_loading_modalidad:boolean = true;
  page_modalidad:number = 1;
  num_modalidad:number = 10;
  search_modalidad:string = '';
  search_modalidad_sub?:Subscription;
  search_modalidad_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  centros:CentroFormacionModel[] = [];
  is_loading_centro:boolean = true;
  page_centro:number = 1;
  num_centro:number = 10;
  search_centro:string = '';
  search_centro_sub?:Subscription;
  search_centro_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  data_sub?:Subscription;

  constructor(){
    super();
    this.form = this.form_builder.group({
      meta_id: new FormControl(null, [
        Validators.required
      ]),
      modalidad_id: new FormControl(null, [
        Validators.required
      ]),
      centro_de_formacion_id: new FormControl(null, [
        Validators.required
      ]),
      met_formacion_operario: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_auxiliar: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_tecnico: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_profundizacion_tecnica: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_tecnologo: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_evento: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_curso_especial: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_bilinguismo: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      met_formacion_sin_bilinguismo: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ])
    });
  }

  ngOnInit(): void {
    this.startSearch();
    this.data_sub = forkJoin([
      this.getModalidad(),
      this.getMeta(),
      this.getCentro()
    ]).subscribe({
      next:([p_modalidad,p_meta,p_centro])=>{
        let {results:modalidades} = p_modalidad;
        let {results:metas} = p_meta;
        let {results:centros} = p_centro;
        this.modalidades = [...modalidades];
        this.metas = [...metas];
        this.centros = [...centros];
        this.is_loading_modalidad = false;
        this.is_loading_meta = false;
        this.is_loading_centro = false;
        this.configForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearchSub();
  }

  private configForm(){
    this.meta_formacion = this.modal.getConfig().nzData.meta_formacion;
    if(this.meta_formacion){
      let {
        modalidad_id,
        meta_id,
        centro_de_formacion_id,
        met_formacion_operario,
        met_formacion_auxiliar,
        met_formacion_tecnico,
        met_formacion_profundizacion_tecnica,
        met_formacion_tecnologo,
        met_formacion_evento,
        met_formacion_curso_especial,
        met_formacion_bilinguismo,
        met_formacion_sin_bilinguismo
      } = this.meta_formacion;
      this.field_modalidad.setValue(modalidad_id);
      this.field_meta.setValue(meta_id);
      this.field_centro_de_formacion.setValue(centro_de_formacion_id);
      this.field_met_formacion_operario.setValue(met_formacion_operario);
      this.field_met_formacion_auxiliar.setValue(met_formacion_auxiliar);
      this.field_met_formacion_tecnico.setValue(met_formacion_tecnico);
      this.field_met_formacion_profundizacion_tecnica.setValue(met_formacion_profundizacion_tecnica);
      this.field_met_formacion_tecnologo.setValue(met_formacion_tecnologo);
      this.field_met_formacion_evento.setValue(met_formacion_evento);
      this.field_met_formacion_curso_especial.setValue(met_formacion_curso_especial);
      this.field_met_formacion_bilinguismo.setValue(met_formacion_bilinguismo);
      this.field_met_formacion_sin_bilinguismo.setValue(met_formacion_sin_bilinguismo);
    }
  }

  private getModalidad(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_modalidad.trim().length > 0) filters['modalidad'] = this.search_modalidad;
    return this.modalidad_service.getAll({filter:filters,page_number:this.page_modalidad});
  }

  onScrollModalidad(){
    if(this.num_modalidad <= this.modalidades.length) return;
    this.resetDataSub();
    this.is_loading_modalidad = true;
    this.page_modalidad = this.page_modalidad + 1;
    this.data_sub = this.getModalidad()
      .subscribe({
        next:(p_modalidad)=>{
          let {results} = p_modalidad;
          this.modalidades = [...this.modalidades,...results];
          this.is_loading_modalidad = false;
        }
      });
  }

  onSearchModalidad(search:string){
    this.is_loading_modalidad = true;    
    this.search_modalidad_subject.next(search);
  }

  private executeSearchModalidad(){
    this.resetDataSub();
    this.page_modalidad = 1;
    this.data_sub = this.getModalidad().subscribe({
      next:(p_modalidad)=>{
        let {results,count} = p_modalidad;        
        this.modalidades = [...results];
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
  }

  private getMeta(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_meta.trim().length > 0) filters['met_anio'] = this.search_meta;
    return this.meta_service.getAll({filter:filters,page_number:this.page_meta});
  }

  onScrollMeta(){
    if(this.num_meta <= this.metas.length) return;
    this.resetDataSub();
    this.is_loading_meta = true;
    this.page_meta = this.page_meta + 1;
    this.data_sub = this.getMeta()
      .subscribe({
        next:(p_meta)=>{
          let {results} = p_meta;
          this.metas = [...this.metas,...results];
          this.is_loading_meta = false;
        }
      });
  }

  onSearchMeta(search:string){
    this.is_loading_meta = true;    
    this.search_meta_subject.next(search);
  }

  private executeSearchMeta(){
    this.resetDataSub();
    this.page_meta = 1;
    this.data_sub = this.getMeta().subscribe({
      next:(p_meta)=>{
        let {results,count} = p_meta;        
        this.metas = [...results];
        this.num_meta = count;
        this.is_loading_meta = false;
      }
    });
  }

  private getCentro(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_centro.trim().length > 0) filters['centro_de_formacion'] = this.search_centro;
    return this.centro_service.getAll({filter:filters,page_number:this.page_centro});
  }

  onScrollCentro(){
    if(this.num_centro <= this.centros.length) return;
    this.resetDataSub();
    this.is_loading_centro = true;
    this.page_centro = this.page_centro + 1;
    this.data_sub = this.getCentro()
      .subscribe({
        next:(p_centro)=>{
          let {results} = p_centro;
          this.centros = [...this.centros,...results];
          this.is_loading_centro = false;
        }
      });
  }

  onSearchCentro(search:string){
    this.is_loading_modalidad = true;    
    this.search_centro_subject.next(search);
  }

  private executeSearchCentro(){
    this.resetDataSub();
    this.page_meta = 1;
    this.data_sub = this.getCentro().subscribe({
      next:(p_centro)=>{
        let {results,count} = p_centro;        
        this.centros = [...results];
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  submitForm(){
    const {value,valid} = this.form;
    if(valid){
      this.modal.close({form:value});
    }
  }

  get field_meta(): FormControl<number> {
    return this.form.get('meta_id') as FormControl<number>;
  }
  
  get field_modalidad(): FormControl<number> {
    return this.form.get('modalidad_id') as FormControl<number>;
  }
  
  get field_centro_de_formacion(): FormControl<number> {
    return this.form.get('centro_de_formacion_id') as FormControl<number>;
  }
  
  get field_met_formacion_operario(): FormControl<number> {
    return this.form.get('met_formacion_operario') as FormControl<number>;
  }
  
  get field_met_formacion_auxiliar(): FormControl<number> {
    return this.form.get('met_formacion_auxiliar') as FormControl<number>;
  }
  
  get field_met_formacion_tecnico(): FormControl<number> {
    return this.form.get('met_formacion_tecnico') as FormControl<number>;
  }
  
  get field_met_formacion_profundizacion_tecnica(): FormControl<number> {
    return this.form.get('met_formacion_profundizacion_tecnica') as FormControl<number>;
  }
  
  get field_met_formacion_tecnologo(): FormControl<number> {
    return this.form.get('met_formacion_tecnologo') as FormControl<number>;
  }
  
  get field_met_formacion_evento(): FormControl<number> {
    return this.form.get('met_formacion_evento') as FormControl<number>;
  }
  
  get field_met_formacion_curso_especial(): FormControl<number> {
    return this.form.get('met_formacion_curso_especial') as FormControl<number>;
  }
  
  get field_met_formacion_bilinguismo(): FormControl<number> {
    return this.form.get('met_formacion_bilinguismo') as FormControl<number>;
  }
  
  get field_met_formacion_sin_bilinguismo(): FormControl<number> {
    return this.form.get('met_formacion_sin_bilinguismo') as FormControl<number>;
  }

  private startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 1;

    this.search_modalidad_sub = this.search_modalidad_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{          
          this.search_modalidad = search;
          this.executeSearchModalidad();
        }
      });
    
    this.search_meta_sub = this.search_meta_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{          
          this.search_meta = search;
          this.executeSearchMeta();
        }
      });
    
    this.search_centro_sub = this.search_centro_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{          
          this.search_centro = search;
          this.executeSearchCentro();
        }
      });
  }
  
  private resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

  private resetSearchSub(){
    if(this.search_modalidad_sub)this.search_modalidad_sub.unsubscribe();
    if(this.search_meta_sub)this.search_meta_sub.unsubscribe();
    if(this.search_centro_sub)this.search_centro_sub.unsubscribe();
  }
}
