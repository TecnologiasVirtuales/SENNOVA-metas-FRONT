import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@shared/functions/date.functions';
import { DF14CentroFormacionModel, DF14EstadoFichaModel, DF14NivelFormacionModel, DF14ProgramaModel, DF14RegionalModel } from '@shared/models/df14.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { Df14Service } from '@shared/services/documents/df14.service';
import { ChartNonAxisOptions } from '@shared/types/chart-options.type';
import { ApexNonAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BehaviorSubject, debounceTime, forkJoin, Observable, skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-chart-fichas',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NzSelectModule,
    FormsModule,
    NzButtonModule,
    NzSpinModule,
    NzDatePickerModule
  ],
  templateUrl: './pie-chart-fichas.component.html',
  styleUrl: './pie-chart-fichas.component.css'
})
export class PieChartFichasComponent implements OnInit,OnChanges,OnDestroy{

  @Input() mostrar_filtros:boolean = false;
  @Input() numero_ficha?:number;

  @Output() filter:EventEmitter<{[key:string]:number|string}> = new EventEmitter();

  df14_service:Df14Service = inject(Df14Service);

  reporte_fichas:ReporteChartModel = {};

  chart_options?:Partial<ChartNonAxisOptions>;

  estado_ficha?:string;
  regional?:string;
  centro_formacion?:string;
  nivel_formacion?:string;
  codigo_programa?:string;

  estados_ficha:DF14EstadoFichaModel[] = [];
  regionales:DF14RegionalModel[] = [];
  centros_formacion:DF14CentroFormacionModel[] = [];
  niveles_formacion:DF14NivelFormacionModel[] = [];
  programas:DF14ProgramaModel[] = [];

  is_loading_estados_ficha:boolean = false;
  is_loading_regionales:boolean = false;
  is_loading_centros_formacion:boolean = false;
  is_loading_niveles:boolean = false;
  is_loading_programas:boolean = false;

  page_estados_ficha:number = 1;
  num_estados_ficha:number = 1;
  page_regionales:number = 1;
  num_regionales:number = 1;
  page_centros_formacion:number = 1;
  num_centros_formacion:number = 1;
  page_niveles:number = 1;
  num_niveles:number = 1;
  page_programas:number = 1;
  num_programas:number = 1;

  search_estados_ficha:string = '';
  search_regionales:string = '';
  search_centros_formacion:string = '';
  search_niveles:string = '';
  search_programas:string = '';

  data_subscription?:Subscription;
  search_estados_ficha_subscription?:Subscription;
  search_regionales_subscription?:Subscription;
  search_centros_formacion_subscription?:Subscription;
  search_niveles_subscription?:Subscription;
  search_programas_subscription?:Subscription;

  search_estados_ficha_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_regionales_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_centros_formacion_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_niveles_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_programas_subject:BehaviorSubject<string> = new BehaviorSubject('');
  
  fecha_fin?: Date = new Date(new Date().getFullYear(), 11, 31);
  fecha_inicio?: Date = new Date(new Date().getFullYear(), 0, 1);

  ngOnInit(): void {
    let data_to_load = [
      this.df14_service.countFichasPorEstado()
    ];
    if(this.mostrar_filtros){
      this.startSearch();
    }
    this.data_subscription = forkJoin(data_to_load)
      .subscribe({
        next:([
          reporte,
        ])=>{
          this.reporte_fichas = reporte as ReporteChartModel;
          this.filter.emit(this.filters);
          this.setChartData();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if(changes['numero_ficha'] && changes['numero_ficha'].firstChange)return;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearch();
  }

  onChangeInicio(): void {
    this.loadData();
  }

  onChangeFin(): void {
    this.loadData();
  }

  loadData(){
    this.resetDataSub();
    this.data_subscription = this.getReportes()
      .subscribe({
        next:(reporte)=>{
          this.reporte_fichas = reporte as ReporteChartModel;
          this.filter.emit(this.filters);
          this.setChartData();
        }
      });
  }

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.regional) filters['regional'] = this.regional;
    if(this.nivel_formacion) filters['nivel_de_formacion'] = this.nivel_formacion;
    if(this.estado_ficha) filters['estado_ficha'] = this.estado_ficha;
    if(this.centro_formacion) filters['sede'] = this.centro_formacion;
    if(this.codigo_programa) filters['codigo_programa'] = this.codigo_programa;
    if(this.fecha_inicio && this.fecha_fin) filters['range_date:fecha_terminacion_ficha'] = `${formatDateToString(this.fecha_inicio)},${formatDateToString(this.fecha_fin)}`
    if(this.numero_ficha) filters['ficha'] = this.numero_ficha;
    return filters;
  }

  get empty_report():boolean {
    return Object.keys(this.reporte_fichas).length > 0;
  }

  getReportes(){
    return this.df14_service.countFichasPorEstado({filter:this.filters});
  }

  getEstadosFicha(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_estados_ficha.length > 0) filters['estado_ficha'] = this.search_estados_ficha;
    return this.df14_service.getEstadosFichas({filter:filters,page_number:this.page_estados_ficha});
  }

  getRegionales(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_regionales.length > 0) filters['regional'] = this.search_regionales;
    return this.df14_service.getRegionales({filter:filters,page_number:this.page_regionales});
  }

  getCentrosFormacion(){
    if(!this.regional) {
      this.centros_formacion = [];
      this.centro_formacion = undefined;
      return undefined;
    };
    let filters:{[key:string]:string|number} = {'regional':this.regional};
    if(this.search_centros_formacion.length > 0) filters['sede'] = this.search_centros_formacion;
    return this.df14_service.getCentrosFormacion({filter:filters});
  }

  getNivelesFormacion(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_niveles.length > 0) filters['nivel_de_formacion'] = this.search_niveles;
    return this.df14_service.getNivelesFormacion({filter:filters,page_number:this.page_niveles});
  }

  getProgramas(){
    if(!this.nivel_formacion) {
      this.programas = [];
      this.codigo_programa = undefined;
      this.page_programas = 1;
      return undefined;
    };    
    let filters:{[key:string]:string|number} = {'nivel_de_formacion':this.nivel_formacion};    
    if(this.search_programas.length > 0) filters['programa'] = this.search_programas;
    return this.df14_service.getProgramas({filter:filters,page_number:this.page_programas});
  }

  onChangeEstadoFicha(){
    this.resetDataSub();
    this.filter.emit(this.filters);
    this.data_subscription = this.getReportes().subscribe({
      next:(reporte)=>{
        this.reporte_fichas = reporte as ReporteChartModel;
        this.setChartData();
      }
    });
  }

  onChangeRegional(){
    this.resetDataSub();
    this.filter.emit(this.filters);
    let data_to_load:Observable<
      ReporteChartModel|
      PaginateModel<DF14CentroFormacionModel>
    >[] = [
      this.getReportes(),
    ];
    this.centro_formacion = undefined;
    this.centros_formacion = [];
    let obs_centros_formacion = this.getCentrosFormacion();
    if(obs_centros_formacion)data_to_load = [...data_to_load,obs_centros_formacion];
    this.data_subscription = forkJoin(data_to_load)
      .subscribe({
        next:([reporte,p_centro_formacion])=>{
          if(p_centro_formacion) {
            let {results:centros_formacion} = p_centro_formacion as PaginateModel<DF14CentroFormacionModel>;
            this.centros_formacion = [...centros_formacion];
          };
          this.reporte_fichas = reporte as ReporteChartModel;
          this.setChartData();
        }
      })
  }

  onChangeCentroFormacion(){
    if(!this.regional) return;
    this.resetDataSub();
    this.filter.emit(this.filters);
    let data_to_load:Observable<ReporteChartModel|PaginateModel<DF14CentroFormacionModel>>[] = [
      this.getReportes(),
    ];
    this.data_subscription = forkJoin(data_to_load)
      .subscribe({
        next:([reporte])=>{
          this.reporte_fichas = reporte as ReporteChartModel;
          this.setChartData();
        }
      });
  }

  onChangeNivelFormacion(){
    this.resetDataSub();
    this.filter.emit(this.filters);
    let data_to_load:Observable<ReporteChartModel|PaginateModel<DF14ProgramaModel>>[] = [
      this.getReportes(),
    ];
    this.codigo_programa = undefined;
    this.programas = [];
    let obs_programas = this.getProgramas();
    if(obs_programas)data_to_load = [...data_to_load,obs_programas];
    this.data_subscription = forkJoin(data_to_load)
      .subscribe({
        next:([reporte,p_programa])=>{
          if(p_programa) {
            let {results:programas,count:num_programas} = p_programa as PaginateModel<DF14ProgramaModel>;
            this.programas = [...programas];
            this.num_programas = num_programas;
          };
          this.reporte_fichas = reporte as ReporteChartModel;
          this.setChartData();
        }
      });
  }

  onChangePrograma(){
    if(!this.nivel_formacion) return;
    this.resetDataSub();
    this.filter.emit(this.filters);
    let data_to_load:Observable<ReporteChartModel|PaginateModel<DF14ProgramaModel>>[] = [
      this.getReportes(),
    ];
    this.data_subscription = forkJoin(data_to_load)
    .subscribe({
      next:([reporte])=>{
        this.reporte_fichas = reporte as ReporteChartModel;
        this.setChartData();
      }
    });
  }

  onScrollEstadoFichas(){
    if(this.estados_ficha.length == this.num_estados_ficha) return;
    let page = this.page_estados_ficha + 1;
    this.resetDataSub();
    this.is_loading_estados_ficha = true;
    this.page_estados_ficha = page;
    this.data_subscription = this.getEstadosFicha()
      .subscribe({
        next:(p_estados)=>{
          let {results} = p_estados;
          this.estados_ficha = [...this.estados_ficha,...results];
          this.is_loading_estados_ficha = false;
        }
      });
  }

  onScrollRegionales(){
    if(this.regionales.length == this.num_regionales) return;
    let page = this.page_regionales +1;
    this.resetDataSub();
    this.is_loading_regionales = true;
    this.page_regionales = page;
    this.data_subscription = this.getRegionales().subscribe({
      next:(p_regionales)=>{
        let {results} = p_regionales;
        this.regionales = [...this.regionales,...results];
        this.is_loading_regionales = false;
      }
    });
  }

  onScrollCentroFormacion(){
    if(this.centros_formacion.length == this.num_centros_formacion) return;
    let page = this.page_centros_formacion + 1;
    this.resetDataSub();
    this.is_loading_centros_formacion = true;
    this.resetDataSub();
    this.page_centros_formacion = page;
    this.data_subscription = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results} = p_centros;
          this.centros_formacion = [...this.centros_formacion,...results];
          this.is_loading_centros_formacion = false;
        }
      });
  }

  onScrollNiveles(){
    if (this.niveles_formacion.length == this.num_niveles) return;
    let page = this.page_niveles + 1;
    this.resetDataSub();
    this.is_loading_niveles = true;
    this.page_niveles = page;
    this.data_subscription = this.getNivelesFormacion().subscribe({
      next:(p_niveles)=>{
        let {results} = p_niveles;
        this.niveles_formacion = [...this.niveles_formacion,...results];
        this.is_loading_niveles = false;
      }
    });
  }

  onScrollPrograma(){
    if (this.programas.length == this.num_programas) return;
    let page = this.page_programas + 1;
    this.resetDataSub();
    this.is_loading_programas = true;
    this.page_programas = page;    
    this.data_subscription = this.getProgramas()!.subscribe({
      next:(p_programa)=>{
        let {results} = p_programa;
        this.programas = [...this.programas,...results];
        this.is_loading_programas = false;
      }
    });
  }

  onSearchEstadoFichas(search:string){
    this.is_loading_estados_ficha = true;
    this.search_estados_ficha_subject.next(search);
  }

  onSearchRegional(search:string){
    this.is_loading_regionales = true;
    this.search_regionales_subject.next(search);
  }

  onSearchCentroFormacion(search:string){
    this.is_loading_centros_formacion = true;
    this.search_centros_formacion_subject.next(search);
  }

  onSearchNivel(search:string){
    this.is_loading_niveles = true;
    this.search_niveles_subject.next(search);
  }

  onSearchPrograma(search:string){
    this.is_loading_programas = true;
    this.search_programas_subject.next(search);  
  }

  executeSearchEstadoFicha(){
    this.resetDataSub();
    this.page_estados_ficha = 1;
    this.data_subscription = this.getEstadosFicha()
      .subscribe({
        next:(p_estados)=>{
          let {results,count} = p_estados;
          this.estados_ficha = [...results];
          this.num_estados_ficha = count;
          this.is_loading_estados_ficha = false;
        }
      })
  }

  executeSearchRegionales(){
    this.resetDataSub();
    this.page_regionales = 1;
    this.data_subscription = this.getRegionales()
      .subscribe({
        next:(p_regionales)=>{
          let {results,count} = p_regionales;
          this.regionales = [...results];
          this.num_regionales = count;
          this.is_loading_regionales = false;
        }
      });
  }

  executeSearchCentroFormacion(){
    this.resetDataSub();
    this.page_centros_formacion = 1;
    this.data_subscription = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results,count} = p_centros;
          this.centros_formacion = [...results];
          this.num_centros_formacion = count;
          this.is_loading_centros_formacion = false;
        }
      });
  }

  executeSearchNiveles(){
    this.resetDataSub();
    this.page_niveles = 1;
    this.data_subscription = this.getNivelesFormacion()
    .subscribe({
      next:(p_niveles)=>{
        let {results,count} = p_niveles;
        this.niveles_formacion = [...results];
        this.num_niveles = count;
        this.is_loading_niveles = false;
      }
    });
  }

  executeSearchProgramas(){
    this.resetDataSub();
    this.page_programas = 1;
    this.data_subscription = this.getProgramas()!
    .subscribe({
      next:(p_programa)=>{
        let {results,count:num_programas} = p_programa;
        this.programas = [...results];
        this.num_programas = num_programas;
        this.is_loading_programas = false;
      }
    });
  }

  setChartData(){
    let labels = Object.keys(this.reporte_fichas);
    let series:ApexNonAxisChartSeries = labels.map((label)=>this.reporte_fichas[label] as number);
    this.chart_options = {
      series:series,
      labels:labels,
      chart:{
        width:400,
        type:'pie',
      },
      legend:{
        position:'left'
      },
      responsive: [
        {
          breakpoint:640,
          options:{
            chart:{
              width:200,
            },
            legend:{
              position:'bottom'
            }
          }
        }
      ]
    };
  }

  startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 1;

    this.search_estados_ficha_subscription = this.search_estados_ficha_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_estados_ficha = search;
          this.executeSearchEstadoFicha();
        }
      });

    this.search_regionales_subscription = this.search_regionales_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_regionales = search;
          this.executeSearchRegionales();
        }
      });
    
    this.search_centros_formacion_subscription = this.search_centros_formacion_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_centros_formacion = search;
          this.executeSearchCentroFormacion();
        }
      });

    this.search_niveles_subscription = this.search_niveles_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_niveles = search;
          this.executeSearchNiveles();
        }
      })

    this.search_programas_subscription = this.search_programas_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_programas = search;
          this.executeSearchProgramas();
        }
      });
  }

  resetDataSub(){
    if(this.data_subscription) this.data_subscription.unsubscribe();
  }

  resetSearch(){
    if(this.search_estados_ficha_subscription) this.search_estados_ficha_subscription.unsubscribe();
    if(this.search_regionales_subscription) this.search_regionales_subscription.unsubscribe();
    if(this.search_centros_formacion_subscription) this.search_centros_formacion_subscription.unsubscribe();
    if(this.search_niveles_subscription) this.search_niveles_subscription.unsubscribe();
    if(this.search_programas_subscription) this.search_programas_subscription.unsubscribe();
  }
}
