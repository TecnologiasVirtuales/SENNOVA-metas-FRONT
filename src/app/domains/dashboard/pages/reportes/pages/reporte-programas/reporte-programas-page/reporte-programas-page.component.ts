import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideTable2 } from '@ng-icons/lucide';
import { P04FichaModel, P04DesercionesModel, P04RegionalModel, P04NivelModel, P04CentroFormacionModel, P04ModalidadModel, P04ProgramaModel } from '@shared/models/p04.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription, BehaviorSubject, forkJoin, Observable, skip, debounceTime } from 'rxjs';
import { InfoFichaComponent } from '../components/info-ficha/info-ficha.component';
import { formatDateToString } from '@shared/functions/date.functions';
import { SearchCellComponent } from '@shared/components/search-cell/search-cell.component';

@Component({
  selector: 'app-reporte-programas-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    NzPaginationModule,
    NzSelectModule,
    FormsModule,
    NzDatePickerModule,
    NzInputModule,
    NzSpinModule,
    InfoFichaComponent,
    SearchCellComponent
  ],
  templateUrl: './reporte-programas-page.component.html',
  styleUrl: './reporte-programas-page.component.css',
  viewProviders: [provideIcons({ 
    lucideTable2,
    lucideEye
  })]
})
export class ReporteProgramasPageComponent implements OnInit,OnDestroy{

  private p04_service:P04Service = inject(P04Service);
  
  data_sub?:Subscription;

  ficha_selected?:P04FichaModel;
  fichas:P04FichaModel[] = [];
  numero_fichas:number = 0;
  page_table:number = 1;
  page_size:number = 10;

  page_reporte:number = 1;

  reporte:ReporteChartModel = {};

  regional?:string;
  regionales:P04RegionalModel[] = [];
  is_loading_regional:boolean = false;
  page_regional:number = 1;
  num_regional:number = 1;
  search_regional?:string;
  search_regional_sub?:Subscription;
  search_regional_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  nivel_formacion?:string;
  niveles:P04NivelModel[] = [];
  is_loading_nivel_formacion: boolean = false;
  page_nivel_formacion: number = 1;
  num_nivel_formacion: number = 1;
  search_nivel_formacion?: string;
  search_nivel_formacion_sub?: Subscription;
  search_nivel_formacion_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  centro_formacion?:string;
  centros:P04CentroFormacionModel[] = [];
  is_loading_centro_formacion: boolean = false;
  page_centro_formacion: number = 1;
  num_centro_formacion: number = 1;
  search_centro_formacion?: string;
  search_centro_formacion_sub?: Subscription;
  search_centro_formacion_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  modalidad?:string;
  modalidades:P04ModalidadModel[] = [];
  is_loading_modalidad: boolean = false;
  page_modalidad: number = 1;
  num_modalidad: number = 1;
  search_modalidad?: string;
  search_modalidad_sub?: Subscription;
  search_modalidad_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  programa?:string;
  programas:P04ProgramaModel[] = [];
  is_loading_programa: boolean = false;
  page_programa: number = 1;
  num_programa: number = 1;
  search_programa?: string;
  search_programa_sub?: Subscription;
  search_programa_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');


  fecha_fin?:Date = new Date(new Date().getFullYear(),11,31);
  fecha_inicio?:Date = new Date(new Date().getFullYear(),0,1);

  buscar_ficha:boolean = false;
  buscar_ficha_value?:number;

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.regional) filters['nombre_regional'] = this.regional;
    if(this.nivel_formacion) filters['nivel_formacion'] = this.nivel_formacion;
    if(this.centro_formacion) filters['nombre_centro'] = this.centro_formacion;
    if(this.modalidad) filters['modalidad_formacion'] = this.modalidad;
    if(this.programa) filters['nombre_programa_formacion'] = this.programa;
    if(this.fecha_inicio && this.fecha_fin) filters['range_date:fecha_terminacion_ficha'] = `${formatDateToString(this.fecha_inicio)},${formatDateToString(this.fecha_fin)}`
    if(this.buscar_ficha_value) filters['identificador_ficha'] = this.buscar_ficha_value;
    return filters;
  }

  get numero_reportes(){
    return Object.keys(this.reporte).length;
  }

  get data_reporte(){
    return Object.keys(this.reporte).map((key)=>{
      return {municipio:key,conteo:this.reporte[key]};
    });
  }

  ngOnInit(): void {
    this.data_sub = forkJoin([
      this.getFichas(),
      this.getReporte(),
    ]).subscribe({
      next:([
        p_fichas,
        reporte
      ])=>{
        let {results,count} = p_fichas;
        this.fichas = [...results];
        this.numero_fichas = count;
        this.reporte = reporte;
        this.startSearch();
      }
    });
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearch();
  }

  onChangeInicio(){    
    this.loadData();
  }

  onChangeFin(){
    this.loadData();
  }

  onSearchByFicha(search:string){
    this.buscar_ficha_value = parseInt(search);
    this.loadData();
  }

  onResetSearchFicha(){
    this.buscar_ficha_value = undefined;
    this.loadData();
  }

  openInfo(ficha:P04FichaModel){
    this.ficha_selected = ficha;
  }

  closeInfo(){
    this.ficha_selected = undefined;    
  }

  private getFichas(){
    return this.p04_service.getFichas({filter:this.filters,page_number:this.page_table,page_size:this.page_size});
  }

  private getReporte(){
    return this.p04_service.countProgramasMunicipio({filter:this.filters});
  }

  private getModalidades(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_modalidad && this.search_modalidad.length > 0) filters['modalidad_formacion'] = this.search_modalidad;
    return this.p04_service.getModalidades({filter:filters,page_number:this.page_modalidad});
  }

  onChangeModalidad(){
    this.loadData();
  }

  onScrollModalidad(){
    if(this.modalidades.length == this.num_modalidad) return;
    this.resetDataSub();
    this.is_loading_modalidad = true;
    this.page_modalidad += 1;
    this.data_sub = this.getModalidades()
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
    this.data_sub = this.getModalidades()
      .subscribe({
        next:(p_modalidad)=>{
          let {results,count} = p_modalidad;
          this.modalidades = [...results];
          this.num_modalidad = count;
          this.is_loading_modalidad = false;
        }
      })
  }

  private getRegionales(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_regional && this.search_regional.length > 0) filters['nombre_regional'] = this.search_regional;
    return this.p04_service.getRegionales({filter:filters,page_number:this.page_regional});
  }

  onChangeRegional(){
    this.resetDataSub();
    let data_to_load:Observable<
      ReporteChartModel|
      PaginateModel<P04FichaModel>|
      PaginateModel<P04CentroFormacionModel>
    >[] = [
      this.getFichas(),
      this.getReporte()
    ];
    let obs_centros_formacion = this.getCentrosFormacion();
    if(obs_centros_formacion) data_to_load = [...data_to_load,obs_centros_formacion];
    this.data_sub = forkJoin(data_to_load).subscribe({
        next:([p_fichas,reporte,p_centro_formacion])=>{
          if(p_centro_formacion) {
            let {results:centros_formacion} = p_centro_formacion as PaginateModel<P04CentroFormacionModel>;
            this.centros = [...centros_formacion];
          };
          this.reporte = reporte as ReporteChartModel;
          let {results,count} = p_fichas as PaginateModel<P04FichaModel>;
          this.fichas = [...results];
          this.numero_fichas = count;
        }
      });
  }

  onScrollRegionales(){
    if(this.regionales.length == this.num_regional) return;
    this.resetDataSub();
    this.is_loading_regional = true;
    this.page_regional += 1;
    this.data_sub = this.getRegionales().subscribe({
      next:(p_regionales)=>{
        let {results} = p_regionales;
        this.regionales = [...this.regionales,...results];
        this.is_loading_regional = false;
      }
    });
  }

  onSearchRegional(search:string){
    this.is_loading_regional = true;
    this.search_regional_subject.next(search);
  }

  private executeSearchRegionales(){
    this.resetDataSub();
    this.page_regional = 1;
    this.data_sub = this.getRegionales()
      .subscribe({
        next:(p_regionales)=>{
          let {results,count} = p_regionales;
          this.regionales = [...results];
          this.num_regional = count;
          this.is_loading_regional = false;
        }
      });
  }

  private getCentrosFormacion(){
    if(!this.regional) {
      this.programas = [];
      this.centro_formacion = undefined;
      return undefined;
    };
    let filters:{[key:string]:string|number} = {'nombre_regional':this.regional};
    if(this.search_centro_formacion && this.search_centro_formacion.length > 0) filters['nombre_centro'] = this.search_centro_formacion;
    return this.p04_service.getCentrosFormacion({filter:filters,page_number:this.page_centro_formacion});
  }

  onChangeCentro(){    
    this.loadData();
  }

  onScrollCentroFormacion(){
    if(this.centros.length == this.num_centro_formacion) return;
    this.resetDataSub();
    this.is_loading_centro_formacion = true;
    this.resetDataSub();
    this.page_centro_formacion += 1;
    this.data_sub = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results} = p_centros;
          this.centros = [...this.centros,...results];
          this.is_loading_centro_formacion = false;
        }
      });
  }

  onSearchCentroFormacion(search:string){
    this.is_loading_centro_formacion = true;
    this.search_centro_formacion_subject.next(search);
  }

  private executeSearchCentroFormacion(){
    this.resetDataSub();
    this.page_centro_formacion = 1;
    this.data_sub = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results,count} = p_centros;
          this.centros = [...results];
          this.num_centro_formacion = count;
          this.is_loading_centro_formacion = false;
        }
      });
  }

  private getNiveles(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_nivel_formacion && this.search_nivel_formacion.length > 0) filters['nivel_formacion'] = this.search_nivel_formacion;
    return this.p04_service.getNiveles({filter:filters,page_number:this.page_regional});
  }

  onChangeNivel(){
    this.resetDataSub();
    let data_to_load:Observable<
      ReporteChartModel|
      PaginateModel<P04FichaModel>|
      PaginateModel<P04ProgramaModel>
    >[] = [
      this.getFichas(),
      this.getReporte()
    ];
    let obs_programas = this.getProgramas();
    if(obs_programas) data_to_load = [...data_to_load,obs_programas];
    this.data_sub = forkJoin(data_to_load).subscribe({
        next:([p_fichas,reporte,p_programa])=>{
          if(p_programa) {
            let {results:programas} = p_programa as PaginateModel<P04ProgramaModel>;
            this.programas = [...programas];
          };
          this.reporte = reporte as ReporteChartModel;
          let {results,count} = p_fichas as PaginateModel<P04FichaModel>;
          this.fichas = [...results];
          this.numero_fichas = count;
        }
      });
  }

  onScrollNivel(){
    if(this.niveles.length == this.num_nivel_formacion) return;
    this.resetDataSub();
    this.is_loading_nivel_formacion = true;
    this.page_regional += 1;
    this.data_sub = this.getNiveles().subscribe({
      next:(p_nivel)=>{
        let {results} = p_nivel;
        this.niveles = [...this.niveles,...results];
        this.is_loading_nivel_formacion = false;
      }
    });
  }

  onSearchNivel(search:string){
    this.is_loading_nivel_formacion = true;
    this.search_nivel_formacion_subject.next(search);
  }

  private executeSearchNivel(){
    this.resetDataSub();
    this.page_nivel_formacion = 1;
    this.data_sub = this.getNiveles()
      .subscribe({
        next:(p_niveles)=>{
          let {results,count} = p_niveles;
          this.niveles = [...results];
          this.num_nivel_formacion = count;
          this.is_loading_nivel_formacion = false;
        }
      });
  }

  private getProgramas(){
    if(!this.nivel_formacion) {
      this.programas = [];
      this.programa = undefined;
      return undefined;
    };
    let filters:{[key:string]:string|number} = {'nivel_formacion':this.nivel_formacion};
    if(this.search_programa && this.search_programa.length > 0) filters['nombre_programa_formacion'] = this.search_programa;
    return this.p04_service.getProgramas({filter:filters,page_number:this.page_centro_formacion});
  }

  onChangePrograma(){
    this.loadData();
  }

  onScrollPrograma(){
    if(this.programas.length == this.num_programa) return;
    this.resetDataSub();
    this.is_loading_programa = true;
    this.resetDataSub();
    this.page_programa += 1;
    this.data_sub = this.getProgramas()!
      .subscribe({
        next:(p_programas)=>{
          let {results} = p_programas;
          this.programas = [...this.programas,...results];
          this.is_loading_programa = false;
        }
      });
  }

  onSearchPrograma(search:string){
    this.is_loading_programa = true;
    this.search_programa_subject.next(search);
  }

  private executeSearchPrograma(){
    this.resetDataSub();
    this.page_programa = 1;
    this.data_sub = this.getProgramas()!
      .subscribe({
        next:(p_programa)=>{
          let {results,count} = p_programa;
          this.programas = [...results];
          this.num_programa = count;
          this.is_loading_programa = false;
        }
      });
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = forkJoin([
      this.getFichas(),
      this.getReporte()
    ]).subscribe({
        next:([p_fichas,reporte])=>{
          let {results,count} = p_fichas;
          this.fichas = [...results];
          this.numero_fichas = count;
          this.reporte = reporte;
        }
      });
  }

  private startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 1;
    
    this.search_regional_sub = this.search_regional_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_regional = search;
          this.executeSearchRegionales();
        }
      });

    this.search_nivel_formacion_sub = this.search_nivel_formacion_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_nivel_formacion = search;
          this.executeSearchNivel();
        }
      });

    this.search_centro_formacion_sub = this.search_centro_formacion_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_centro_formacion = search;
          this.executeSearchCentroFormacion();
        }
      });

    this.search_programa_sub = this.search_programa_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_programa = search;
          this.executeSearchPrograma();
        }
      });


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
  }

  changePage(p_page:number){
    this.page_table = p_page;
    this.loadData();
  }

  changePageReporte(p:number){
    this.page_reporte = p;
  }

  sizeChange(){
    this.page_table = 1;
    this.page_reporte = 1;
    this.loadData();
  }

  private resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

  private resetSearch(){
    if(this.search_regional_sub) this.search_regional_sub.unsubscribe();
    if(this.search_nivel_formacion_sub) this.search_nivel_formacion_sub.unsubscribe();
    if(this.search_centro_formacion_sub) this.search_centro_formacion_sub.unsubscribe();
    if(this.search_modalidad_sub) this.search_modalidad_sub.unsubscribe();
  }
  
}
