import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { MetasFormacionService } from '@shared/services/metas-formacion.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BehaviorSubject, debounceTime, forkJoin, skip, Subscription } from 'rxjs';
import { MetasFormacionActionsComponent } from "../components/metas-formacion-actions/metas-formacion-actions.component";
import { lucideGoal } from '@ng-icons/lucide';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { ModalidadService } from '@shared/services/modalidad.service';
import { MetasService } from '@shared/services/metas.service';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { MetaModel } from '@shared/models/meta.model';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-metas-formacion-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    SenaLoadingComponent,
    CanUseActionsDirective,
    NzPaginationModule,
    MetasFormacionActionsComponent,
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule
],
  templateUrl: './metas-formacion-page.component.html',
  styleUrl: './metas-formacion-page.component.css',
  viewProviders: [provideIcons({ 
    lucideGoal
  })]
})
export class MetasFormacionPageComponent implements OnInit,OnDestroy{

  private meta_formacion_service = inject(MetasFormacionService);
  private modalidad_service = inject(ModalidadService);
  private meta_service = inject(MetasService);
  private centro_service = inject(CentroFormacionService);
  private data_sub?: Subscription;

  metas_formacion:MetaFormacionModel[] = [];

  numero_metas:number = 0;

  page:number = 1;
  page_size:number = 10;

  loading:boolean = true;

  meta?:string;
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

  ngOnInit(): void {
    this.data_sub = forkJoin([
      this.getData(),
      this.getModalidad(),
      this.getMeta(),
      this.getCentro()
    ]).subscribe({
      next:([p_meta_formacion,p_modalidad,p_meta,p_centro])=>{
        let {results,count} = p_meta_formacion;
        this.metas_formacion = [...results];
        this.numero_metas = count;
        let {results:modalidades,count:num_modalidad} = p_modalidad;
        this.modalidades = [...modalidades];
        this.num_modalidad = num_modalidad;
        let {results:metas,count:num_meta} = p_meta;
        this.metas = [...metas];
        this.num_meta = num_meta;
        let {results:centros,count:num_centro} = p_centro;
        this.centros = [...centros];
        this.num_centro = num_centro;
        this.is_loading_meta = false;
        this.is_loading_centro = false;
        this.is_loading_modalidad = false;
        this.onLoad(false);
      }
    });
  }
  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearchSub();
  }

  get filters():{[key:string]:string|number}{
    let filters:{[key:string]:string|number} = {};
    if(this.meta) filters['meta.met_anio'] = this.meta;
    return filters;
  }

  onChangeMeta(){
    this.loadData();
  }

  private getData(){
    return this.meta_formacion_service.getAll({page_number:this.page,page_size:this.page_size,filter:this.filters});
  }

  private loadData(){
    this.loading = true;
    this.resetDataSub();
    this.data_sub = this.getData().subscribe({
      next:(p_metas)=>{        
        let {results,count} = p_metas;
        this.metas_formacion = [...results];
        this.numero_metas = count;
        this.onLoad(false);
      } 
    });
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

  changePage(p_page:number){
    this.page = p_page;
    this.loadData();
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  onCreate(meta:MetaFormacionModel) {
    this.metas_formacion = [...this.metas_formacion,meta];
  }

  onUpdate(data:{metaFormacion:MetaFormacionModel, index:number}) {    
    let {metaFormacion,index} = data;
    let metas = [...this.metas_formacion];
    metas[index] = metaFormacion;
    this.metas_formacion = [...metas];
  }

  onDelete(index:number) {
    let metas = [...this.metas_formacion];
    metas.splice(index,1);
    this.metas_formacion = [...metas];
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
