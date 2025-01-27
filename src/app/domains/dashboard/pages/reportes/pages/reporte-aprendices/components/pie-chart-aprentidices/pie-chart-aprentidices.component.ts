import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DF14CentroFormacionModel, DF14EstadoAprendizModel, DF14NivelFormacionModel, DF14ProgramaModel, DF14RegionalModel, DF14TipoDocumentoModel } from '@shared/models/df14.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { Df14Service } from '@shared/services/documents/df14.service';
import { ChartNonAxisOptions } from '@shared/types/chart-options.type';
import { ApexNonAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BehaviorSubject,debounceTime, forkJoin, Observable,skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-chart-aprentidices',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NzSelectModule,
    FormsModule,
    NzButtonModule,
    NzSpinModule
  ],
  templateUrl: './pie-chart-aprentidices.component.html',
  styleUrl: './pie-chart-aprentidices.component.css'
})
export class PieChartAprentidicesComponent implements OnInit,OnDestroy{
  
  @Input() mostrar_filtros:boolean = false;

  @Output() filter:EventEmitter<{[key:string]:number|string}> = new EventEmitter();

  df14_service:Df14Service = inject(Df14Service);

  reporte_aprendices:ReporteChartModel = {};

  chart_options?:Partial<ChartNonAxisOptions>;

  regional?:string;
  nivel_formacion?:string;
  estado_aprendiz?:string;
  centro_formacion?:string;
  codigo_programa?:number;
  tipo_documento?:string;

  regionales:DF14RegionalModel[] = [];
  niveles_formacion:DF14NivelFormacionModel[] = [];
  estados_aprendiz:DF14EstadoAprendizModel[] = [];
  tipos_documento:DF14TipoDocumentoModel[] = [];
  centros_formacion:DF14CentroFormacionModel[] = [];
  programas:DF14ProgramaModel[] = [];

  is_loading_tipo_documento:boolean = false;
  is_loading_estados_aprendiz:boolean = false;
  is_loading_regionales:boolean = false;
  is_loading_centro_formacion:boolean = false;
  is_loading_niveles:boolean = false;
  is_loading_programas:boolean = false;

  page_tipo_documento:number = 1;
  num_tipo_documento:number = 1;
  page_estados_aprendiz:number = 1;
  num_estados_aprendiz:number = 1;
  page_regionales:number = 1;
  num_regionales:number = 1;
  page_centro_formacion:number = 1;
  num_centro_formacion:number = 1;
  page_niveles:number = 1;
  num_niveles:number = 1;
  page_programas:number = 1;
  num_programas:number = 1;

  search_tipo_documento:string = '';
  search_estados_aprendiz:string = '';
  search_regionales:string = '';
  search_centro_formacion:string = '';
  search_niveles:string = '';
  search_program:string = '';

  data_subscription?:Subscription;
  search_tipo_documento_subscription?:Subscription;
  search_estados_aprendiz_subscription?:Subscription;
  search_regionales_subscription?:Subscription;
  search_centro_formacion_subscription?:Subscription;
  search_niveles_subscription?:Subscription;
  search_program_subscription?:Subscription;

  search_tipo_documento_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_estados_aprendiz_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_regionales_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_centro_formacion_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_niveles_subject:BehaviorSubject<string> = new BehaviorSubject('');
  search_program_subject:BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    let data_to_load:Observable<
      ReporteChartModel|
      PaginateModel<DF14RegionalModel>|
      PaginateModel<DF14NivelFormacionModel>|
      PaginateModel<DF14EstadoAprendizModel>|
      PaginateModel<DF14TipoDocumentoModel>
    >[] = [
      this.df14_service.countAprendicesPorEstado()
    ];
    if(this.mostrar_filtros){
      this.startSearch();
      data_to_load = [
        ...data_to_load,
        this.df14_service.getTiposDocumento()
      ];
    }
    this.data_subscription = forkJoin(data_to_load)
      .subscribe({
        next:([
          reporte,
          p_tipos_documento
        ])=>{
          if (this.mostrar_filtros) {
            let {results:tipos_documento} = p_tipos_documento as PaginateModel<DF14TipoDocumentoModel>;
            this.tipos_documento = [...tipos_documento];
          }
          this.reporte_aprendices = reporte as ReporteChartModel;
          this.setChartData();
        }
      })
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearch(); 
  }

  get filters():{[key:string]:string|number}{
    let filters:{[key:string]:string|number} = {};
    if(this.regional) filters['regional'] = this.regional;
    if(this.nivel_formacion) filters['nivel_de_formacion'] = this.nivel_formacion;
    if(this.estado_aprendiz) filters['estado_aprendiz'] = this.estado_aprendiz;
    if(this.centro_formacion) filters['sede'] = this.centro_formacion;
    if(this.codigo_programa) filters['codigo_programa'] = this.codigo_programa;
    if(this.tipo_documento) filters['tipo_documento'] = this.tipo_documento;
    return filters;
  }

  get empty_report():boolean {
    return Object.keys(this.reporte_aprendices).length > 0;
  }

  getReportes(){
    return this.df14_service.countAprendicesPorEstado({filter:this.filters});
  }

  getTiposDocumento(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_tipo_documento.length > 0) filters['tipo_documento'] = this.search_tipo_documento;
    return this.df14_service.getTiposDocumento({filter:filters,page_number:this.page_tipo_documento});
  }

  getEstadosAprendiz(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_estados_aprendiz.length > 0) filters['estado_aprendiz'] = this.search_estados_aprendiz;
    return this.df14_service.getEstadosAprendiz({filter:filters,page_number:this.page_estados_aprendiz});
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
    if(this.search_centro_formacion.length > 0) filters['sede'] = this.search_centro_formacion;
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
    if(this.search_program.length > 0) filters['programa'] = this.search_program;
    return this.df14_service.getProgramas({filter:filters,page_number:this.page_programas});
  }

  onChangeEstadoAprendiz(){
    this.resetDataSub();
    this.filter.emit(this.filters);
    this.data_subscription = this.getReportes().subscribe({
      next:(reporte)=>{
        this.reporte_aprendices = reporte as ReporteChartModel;
        this.setChartData();
      }
    });
  }

  onChangeTipoDocumento(){
    this.resetDataSub();
    this.filter.emit(this.filters);
    this.data_subscription = this.getReportes().subscribe({
      next:(reporte)=>{
        this.reporte_aprendices = reporte as ReporteChartModel;
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

          this.reporte_aprendices = reporte as ReporteChartModel;
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
          this.reporte_aprendices = reporte as ReporteChartModel;
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
          this.reporte_aprendices = reporte as ReporteChartModel;
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
        this.reporte_aprendices = reporte as ReporteChartModel;
        this.setChartData();
      }
    });
  }

  onScrollTipoDocumento(){
    if(this.tipos_documento.length == this.num_tipo_documento) return;
    let page = this.page_tipo_documento + 1;
    this.resetDataSub();
    this.is_loading_tipo_documento = true;
    this.page_tipo_documento = page;
    this.data_subscription = this.getTiposDocumento()
      .subscribe({
        next:(p_tipos)=>{
          let {results} = p_tipos;
          this.tipos_documento = [...this.tipos_documento,...results];
          this.is_loading_tipo_documento = false;
        }
      });
  }

  onScrollEstadoAprendiz(){
    if(this.estados_aprendiz.length == this.num_estados_aprendiz) return;
    let page = this.page_estados_aprendiz + 1;
    this.resetDataSub();
    this.is_loading_estados_aprendiz = true;
    this.page_estados_aprendiz = page;
    this.data_subscription = this.getEstadosAprendiz()
      .subscribe({
        next:(p_estados)=>{
          let {results} = p_estados;
          this.estados_aprendiz = [...this.estados_aprendiz,...results];
          this.is_loading_estados_aprendiz = false;
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
    if(this.centros_formacion.length == this.num_centro_formacion) return;
    let page = this.page_centro_formacion + 1;
    this.resetDataSub();
    this.is_loading_centro_formacion = true;
    this.resetDataSub();
    this.page_centro_formacion = page;
    this.data_subscription = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results} = p_centros;
          this.centros_formacion = [...this.centros_formacion,...results];
          this.is_loading_centro_formacion = false;
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

  onSearchTipoDocumento(search:string){
    this.is_loading_tipo_documento = true;
    this.search_tipo_documento_subject.next(search);
  }

  onSearchEstadoAprendiz(search:string){
    this.is_loading_estados_aprendiz = true;
    this.search_estados_aprendiz_subject.next(search);
  }

  onSearchRegional(search:string){
    this.is_loading_regionales = true;
    this.search_regionales_subject.next(search);
  }

  onSearchCentroFormacion(search:string){
    this.is_loading_centro_formacion = true;
    this.search_centro_formacion_subject.next(search);
  }

  onSearchNivel(search:string){
    this.is_loading_niveles = true;
    this.search_niveles_subject.next(search);
  }

  onSearchPrograma(search:string){
    this.is_loading_programas = true;
    this.search_program_subject.next(search);  
  }

  executeSearchTipoDocumento(){
    this.resetDataSub();
    this.page_tipo_documento = 1;
    this.data_subscription = this.getTiposDocumento()
      .subscribe({
        next:(p_tipos)=>{
          let {results,count} = p_tipos;
          this.tipos_documento = [...results];
          this.num_tipo_documento = count;
          this.is_loading_tipo_documento = false;
        }
      });
  }

  executeSearchEstadoAprendiz(){
    this.resetDataSub();
    this.page_estados_aprendiz = 1;
    this.data_subscription = this.getEstadosAprendiz()
      .subscribe({
        next:(p_estados)=>{
          let {results,count} = p_estados;
          this.estados_aprendiz = [...results];
          this.num_estados_aprendiz = count;
          this.is_loading_estados_aprendiz = false;
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
    this.page_centro_formacion = 1;
    this.data_subscription = this.getCentrosFormacion()!
      .subscribe({
        next:(p_centros)=>{
          let {results,count} = p_centros;
          this.centros_formacion = [...results];
          this.num_centro_formacion = count;
          this.is_loading_centro_formacion = false;
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
    let labels = Object.keys(this.reporte_aprendices);
    let series:ApexNonAxisChartSeries = labels.map((label)=>this.reporte_aprendices[label]);
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

    this.search_tipo_documento_subscription = this.search_tipo_documento_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_tipo_documento = search;
          this.executeSearchTipoDocumento();
        }
      });

    this.search_estados_aprendiz_subscription = this.search_estados_aprendiz_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_estados_aprendiz = search;
          this.executeSearchEstadoAprendiz();
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
    
    this.search_centro_formacion_subscription = this.search_centro_formacion_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_centro_formacion = search;
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

    this.search_program_subscription = this.search_program_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_program = search;
          this.executeSearchProgramas();
        }
      });
  }

  resetDataSub(){
    if(this.data_subscription) this.data_subscription.unsubscribe();
  }

  resetSearch(){
    if(this.search_estados_aprendiz_subscription) this.search_estados_aprendiz_subscription.unsubscribe();
    if(this.search_regionales_subscription) this.search_regionales_subscription.unsubscribe();
    if(this.search_centro_formacion_subscription) this.search_centro_formacion_subscription.unsubscribe();
    if(this.search_niveles_subscription) this.search_niveles_subscription.unsubscribe();
    if(this.search_program_subscription) this.search_program_subscription.unsubscribe();
  }
}
