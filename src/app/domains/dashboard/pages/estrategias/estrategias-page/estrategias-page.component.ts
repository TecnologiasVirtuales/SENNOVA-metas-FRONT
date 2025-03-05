import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EstrategiaActionsComponent } from '../components/estrategia-actions/estrategia-actions.component';
import { EstrategiaCardComponent } from '../components/estrategia-card/estrategia-card.component';
import { EstrategiaDetalleActionsComponent } from '../components/estrategia-detalle-actions/estrategia-detalle-actions.component';
import { EstrategiasService } from '@shared/services/estrategias.service';
import { MetasService } from '@shared/services/metas.service';
import { ModalidadService } from '@shared/services/modalidad.service';
import { BehaviorSubject, debounceTime, forkJoin, skip, Subscription } from 'rxjs';
import { EstrategiasDetalleService } from '@shared/services/estrategias-detalle.service';
import { EstrategiaDetalleModel } from '@shared/models/estrategia-detalle.model';
import { MetaModel } from '@shared/models/meta.model';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { formatDateToString } from '@shared/functions/date.functions';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { lucideCheckCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-estrategias-page',
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
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
    FormsModule,
    NzSpinModule,
    EstrategiaActionsComponent,
    EstrategiaCardComponent,
    EstrategiaDetalleActionsComponent,
  ],
  templateUrl: './estrategias-page.component.html',
  styleUrl: './estrategias-page.component.css',
  viewProviders: [provideIcons({ 
    lucideCheckCheck
  })]
})
export class EstrategiasPageComponent {

  private estrategia_detalle_service = inject(EstrategiasDetalleService);
  private modalidad_service = inject(ModalidadService);
  private meta_service = inject(MetasService);
  private estrategias_service = inject(EstrategiasService);
  private data_sub?: Subscription;

  estrategias_detalle:EstrategiaDetalleModel[] = [];

  numero_detalles:number = 0;

  page:number = 1;
  page_size:number = 10;

  loading:boolean = true;

  meta?:string;
  metas:MetaModel[] = [];
  is_loading_meta:boolean = true;
  page_meta:number = 1;
  num_meta:number = 10;
  search_meta?:string;
  search_meta_sub?:Subscription;
  search_meta_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  modalidad?:string;
  modalidades:ModalidadModel[] = [];
  is_loading_modalidad:boolean = true;
  page_modalidad:number = 1;
  num_modalidad:number = 10;
  search_modalidad?:string;
  search_modalidad_sub?:Subscription;
  search_modalidad_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  size_estrategia:number = 5;
  estrategia?:string;
  estrategias:EstrategiaModel[] = [];
  is_loading_estrategia:boolean = true;
  page_estrategia:number = 1;
  num_estrategia:number = 10;
  search_estrategia?:string;
  search_estrategia_sub?:Subscription;
  search_estraetgia_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');

  fecha_fin?:Date;
  fecha_inicio?:Date;

  ngOnInit(): void {
    this.startSearch();
    this.data_sub = forkJoin([
      this.getData(),
      this.getModalidad(),
      this.getMeta(),
      this.getEstrategia()
    ]).subscribe({
      next:([p_detalles,p_modalidad,p_meta,p_estrategia])=>{
        let {results,count} = p_detalles;
        this.estrategias_detalle = [...results];
        this.numero_detalles = count;
        let {results:modalidades,count:num_modalidad} = p_modalidad;
        this.modalidades = [...modalidades];
        this.num_modalidad = num_modalidad;
        let {results:metas,count:num_meta} = p_meta;
        this.metas = [...metas];
        this.num_meta = num_meta;
        let {results:estrategias,count:num_estrategia} = p_estrategia;
        this.estrategias = [...estrategias];
        this.num_estrategia = num_estrategia;
        this.is_loading_meta = false;
        this.is_loading_modalidad = false;
        this.is_loading_estrategia = false;
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
    if(this.modalidad) filters['modalidad.modalidad'] = this.modalidad;
    if(this.estrategia) filters['estrategia.est_nombre'] = this.estrategia;
    if(this.fecha_inicio) filters['meta.met_fecha_inicio'] = formatDateToString(this.fecha_inicio);
    if(this.fecha_fin) filters['meta.met_fecha_fin'] = formatDateToString(this.fecha_fin);
    return filters;
  }

  onChangeMeta(){
    this.loadData();
  }

  onChangeModalidad(){
    this.loadData();
  }

  onChangeInicio(){
    this.loadData();
  }

  onChangeFin(){
    this.loadData();
  }

  onChangeEstrategia(estrategia:EstrategiaModel){
    if(this.estrategia == estrategia.est_nombre){
      this.estrategia = undefined;
      this.loadData();
      return;
    }
    this.estrategia = estrategia.est_nombre;
    this.loadData();
  }

  private getData(){
    return this.estrategia_detalle_service.getAll({page_number:this.page,page_size:this.page_size,filter:this.filters});
  }

  private loadData(){
    this.loading = true;
    this.resetDataSub();
    this.data_sub = this.getData().subscribe({
      next:(p_detalles)=>{        
        let {results,count} = p_detalles;
        this.estrategias_detalle = [...results];
        this.numero_detalles = count;
        this.onLoad(false);
      } 
    });
  }

  private getModalidad(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_modalidad && this.search_modalidad.trim().length > 0) filters['modalidad'] = this.search_modalidad;
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
    if(this.search_meta && this.search_meta.trim().length > 0) filters['met_anio'] = this.search_meta;
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
    if(this.search_estrategia && this.search_estrategia.trim().length > 0) filters['est_nombre'] = this.search_estrategia;
    return this.estrategias_service.getAll({filter:filters,page_number:this.page_estrategia,page_size:this.size_estrategia});
  }

  onCreateEstrategia(estrategia:EstrategiaModel){
    this.estrategias = [...this.estrategias,estrategia];
  }

  onUpdateEstrategia(data:{estrategia:EstrategiaModel, index:number}) {    
    let {estrategia,index} = data;
    let estrategias = [...this.estrategias];
    estrategias[index] = estrategia;
    this.estrategias = [...estrategias];
  }

  onDeleteEstrategia(index:number) {
    let estrategias = [...this.estrategias];
    estrategias.splice(index,1);
    this.estrategias = [...estrategias];
  }

  onScrollEstrategia(){
    if(this.num_estrategia <= this.estrategias.length) return;
    this.resetDataSub();
    this.is_loading_estrategia = true;
    this.page_estrategia = this.page_estrategia + 1;
    this.data_sub = this.getEstrategia()
      .subscribe({
        next:(p_estrategia)=>{
          let {results} = p_estrategia;
          this.estrategias = [...this.estrategias,...results];
          this.is_loading_estrategia = false;
        }
      });
  }

  onSearchEstrategia(search:string){
    this.is_loading_estrategia = true;    
    this.search_estraetgia_subject.next(search);
  }

  private executeSearchEstrategia(){
    this.resetDataSub();
    this.page_estrategia = 1;
    this.data_sub = this.getEstrategia().subscribe({
      next:(p_estrategia)=>{
        let {results,count} = p_estrategia;        
        this.estrategias = [...results];
        this.num_estrategia = count;
        this.is_loading_estrategia = false;
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

  onCreate(detalle:EstrategiaDetalleModel) {
    this.estrategias_detalle = [...this.estrategias_detalle,detalle];
  }

  onUpdate(data:{detalle:EstrategiaDetalleModel, index:number}) {    
    let {detalle,index} = data;
    let detalles = [...this.estrategias_detalle];
    detalles[index] = detalle;
    this.estrategias_detalle = [...detalles];
  }

  onDelete(index:number) {
    let detalles = [...this.estrategias_detalle];
    detalles.splice(index,1);
    this.estrategias_detalle = [...detalles];
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

    this.search_estrategia_sub = this.search_estraetgia_subject
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
