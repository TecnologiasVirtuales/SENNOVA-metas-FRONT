import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstrategiaDetalleModel } from '@shared/models/estrategia-detalle.model';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { MetaModel } from '@shared/models/meta.model';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { EstrategiasService } from '@shared/services/estrategias.service';
import { MetasService } from '@shared/services/metas.service';
import { ModalidadService } from '@shared/services/modalidad.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { BehaviorSubject, debounceTime, forkJoin, skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-estrategia-detalle-form',
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
  templateUrl: './estrategia-detalle-form.component.html',
  styleUrls: [
    './estrategia-detalle-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class EstrategiaDetalleFormComponent extends FormStyle implements OnInit, OnDestroy {

  private form_builder = inject(FormBuilder);
  private modalidad_service = inject(ModalidadService);
  private meta_service = inject(MetasService);
  private estrategia_service = inject(EstrategiasService);
  private modal = inject(NzModalRef);

    form:FormGroup;
  
    detalle?:EstrategiaDetalleModel;
  
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
    estrategias:EstrategiaModel[] = [];
    is_loading_estrategia:boolean = true;
    page_estrategia:number = 1;
    num_estrategia:number = 10;
    search_estrategia:string = '';
    search_estrategia_sub?:Subscription;
    search_estrategia_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
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
        estrategia_id: new FormControl(null, [
          Validators.required
        ]),
        estd_operario_meta:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_auxiliar_meta:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_tecnico_meta:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_profundizacion_tecnica_meta:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_tecnologo:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_evento:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_curso_especial:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_bilinguismo:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
        estd_sin_bilinguismo:new FormControl(null, [
          Validators.required,
          Validators.min(0)
        ]),
      });
    }

    get field_meta(): FormControl<number> {
      return this.form.get('meta_id') as FormControl<number>;
    }
    
    get field_modalidad(): FormControl<number> {
      return this.form.get('modalidad_id') as FormControl<number>;
    }
    
    get field_estrategia(): FormControl<number> {
      return this.form.get('estrategia_id') as FormControl<number>;
    }
    
    get field_estd_operario_meta(): FormControl<number> {
      return this.form.get('estd_operario_meta') as FormControl<number>;
    }
    
    get field_estd_auxiliar_meta(): FormControl<number> {
      return this.form.get('estd_auxiliar_meta') as FormControl<number>;
    }
    
    get field_estd_tecnico_meta(): FormControl<number> {
      return this.form.get('estd_tecnico_meta') as FormControl<number>;
    }
    
    get field_estd_profundizacion_tecnica_meta(): FormControl<number> {
      return this.form.get('estd_profundizacion_tecnica_meta') as FormControl<number>;
    }
    
    get field_estd_tecnologo(): FormControl<number> {
      return this.form.get('estd_tecnologo') as FormControl<number>;
    }
    
    get field_estd_evento(): FormControl<number> {
      return this.form.get('estd_evento') as FormControl<number>;
    }
    
    get field_estd_curso_especial(): FormControl<number> {
      return this.form.get('estd_curso_especial') as FormControl<number>;
    }
    
    get field_estd_bilinguismo(): FormControl<number> {
      return this.form.get('estd_bilinguismo') as FormControl<number>;
    }
    
    get field_estd_sin_bilinguismo(): FormControl<number> {
      return this.form.get('estd_sin_bilinguismo') as FormControl<number>;
    }
    

    ngOnInit(): void {
      this.startSearch();
      this.data_sub = forkJoin([
        this.getModalidad(),
        this.getMeta(),
        this.getEstrategia()
      ]).subscribe({
        next:([p_modalidad,p_meta,p_estrategia])=>{
          let {results:modalidades} = p_modalidad;
          let {results:metas} = p_meta;
          let {results:estrategias} = p_estrategia;
          this.modalidades = [...modalidades];
          this.metas = [...metas];
          this.estrategias = [...estrategias];
          this.is_loading_modalidad = false;
          this.is_loading_meta = false;
          this.is_loading_estrategia = false;
          this.configForm();
        }
      });
    }

    ngOnDestroy(): void {
      
    }

    private configForm() {
      this.detalle = this.modal.getConfig().nzData.detalle;
      if (this.detalle) {
        let {
          modalidad_id,
          meta_id,
          estrategia_id,
          estd_operario_meta,
          estd_auxiliar_meta,
          estd_tecnico_meta,
          estd_profundizacion_tecnica_meta,
          estd_tecnologo,
          estd_evento,
          estd_curso_especial,
          estd_bilinguismo,
          estd_sin_bilinguismo
        } = this.detalle;
        this.field_modalidad.setValue(modalidad_id);
        this.field_meta.setValue(meta_id);
        this.field_estrategia.setValue(estrategia_id);
        this.field_estd_operario_meta.setValue(estd_operario_meta);
        this.field_estd_auxiliar_meta.setValue(estd_auxiliar_meta);
        this.field_estd_tecnico_meta.setValue(estd_tecnico_meta);
        this.field_estd_profundizacion_tecnica_meta.setValue(estd_profundizacion_tecnica_meta);
        this.field_estd_tecnologo.setValue(estd_tecnologo);
        this.field_estd_evento.setValue(estd_evento);
        this.field_estd_curso_especial.setValue(estd_curso_especial);
        this.field_estd_bilinguismo.setValue(estd_bilinguismo);
        this.field_estd_sin_bilinguismo.setValue(estd_sin_bilinguismo);
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

    private getEstrategia(){
      let filters:{[key:string]:string|number} = {};    
      if(this.search_estrategia.trim().length > 0) filters['est_nombre'] = this.search_estrategia;
      return this.estrategia_service.getAll({filter:filters,page_number:this.page_estrategia});
    }
  
    onScrollEstrategia(){
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
  
    onSearchEstrategia(search:string){
      this.is_loading_meta = true;    
      this.search_meta_subject.next(search);
    }
  
    private executeSearchEstrategia(){
      this.resetDataSub();
      this.page_meta = 1;
      this.data_sub = this.getEstrategia().subscribe({
        next:(p_meta)=>{
          let {results,count} = p_meta;        
          this.estrategias = [...results];
          this.num_estrategia = count;
          this.is_loading_estrategia = false;
        }
      });
    }

    submitForm(){
      const {value,valid} = this.form;
      if(valid){
        this.modal.close({form:value});
      }
    }

    private startSearch(){
      let search_wait:number = 200;
      let search_skip:number = 0;
  
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
      
      this.search_estrategia_sub = this.search_estrategia_subject
        .pipe(
          skip(search_skip),
          debounceTime(search_wait)
        ).subscribe({
          next:(search)=>{          
            this.search_estrategia = search;
            this.executeSearchEstrategia();
          }
        });
    }
  
    private resetDataSub(){
      if(this.data_sub)this.data_sub.unsubscribe();
    }
  
    private resetSearchSub(){
      if(this.search_modalidad_sub)this.search_modalidad_sub.unsubscribe();
      if(this.search_meta_sub)this.search_meta_sub.unsubscribe();
      if(this.search_estrategia_sub)this.search_estrategia_sub.unsubscribe();
    }

}
