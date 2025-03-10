import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTable2 } from '@ng-icons/lucide';
import { formatDateToString } from '@shared/functions/date.functions';
import { P04CentroFormacionModel, P04DesercionesModel, P04FichaModel, P04JornadaModel, P04ModalidadModel, P04MunicipioModel, P04NivelModel, P04ProgramaModel, P04RegionalModel } from '@shared/models/p04.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BehaviorSubject, debounceTime, forkJoin, Observable, skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-reporte-retirados-page',
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
    NzSpinModule
  ],
  templateUrl: './reporte-retirados-page.component.html',
  styleUrl: './reporte-retirados-page.component.css',
  viewProviders: [provideIcons({ 
    lucideTable2
  })]
})
export class ReporteRetiradosPageComponent implements OnInit,OnDestroy{

  private p04_service:P04Service = inject(P04Service);

  data_sub?:Subscription;

  fichas:P04FichaModel[] = [];
  numero_fichas:number = 0;
  page_table:number = 1;
  page_size:number = 10;

  deserciones:P04DesercionesModel = {
    activos:0,
    desertados:0,
    total:0
  }

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
  municipio?:string;
  municipios:P04MunicipioModel[] = [];
  is_loading_municipio: boolean = false;
  page_municipio: number = 1;
  num_municipio: number = 1;
  search_municipio?: string;
  search_municipio_sub?: Subscription;
  search_municipio_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  jornada?:string;
  jornadas: P04JornadaModel[] = [];
  is_loading_jornada: boolean = false;
  page_jornada: number = 1;
  num_jornada: number = 1;
  search_jornada?: string;
  search_jornada_sub?: Subscription;
  search_jornada_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
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

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.regional) filters['nombre_regional'] = this.regional;
    if(this.nivel_formacion) filters['nivel_formacion'] = this.nivel_formacion;
    if(this.centro_formacion) filters['nombre_centro'] = this.centro_formacion;
    if(this.municipio) filters['nombre_municipio_curso'] = this.municipio;
    if(this.jornada) filters['nombre_jornada'] = this.jornada;
    if(this.modalidad) filters['modalidad_formacion'] = this.modalidad;
    if(this.programa) filters['nombre_programa_formacion'] = this.programa;
    if(this.fecha_inicio && this.fecha_fin) filters['range_date:fecha_terminacion_ficha'] = `${formatDateToString(this.fecha_inicio)},${formatDateToString(this.fecha_fin)}`
    return filters;
  }

  ngOnInit(): void {
    this.data_sub = forkJoin([
      this.getFichas(),
      this.getJornadas(),
      this.getDeserciones()
    ]).subscribe({
      next:([
        p_fichas,
        p_jornada,
        deserciones
      ])=>{
        let {results,count} = p_fichas;
        this.fichas = [...results];
        this.numero_fichas = count;
        let {results:jornadas,count:num_jornada} = p_jornada;
        this.jornadas = [...jornadas];
        this.num_jornada = num_jornada;
        this.deserciones = deserciones;
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

  private getFichas(){
    return this.p04_service.getFichas({filter:this.filters,page_number:this.page_table,page_size:this.page_size});
  }

  private getDeserciones(){
    return this.p04_service.getDeserciones({filter:this.filters});
  }

  private getJornadas(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_jornada && this.search_jornada.length > 0) filters['nombre_jornada'] = this.search_jornada;
    return this.p04_service.getJornadas({filter:filters,page_number:this.page_jornada});
  }

  onChangeJornada(){
    this.loadData();
  }

  onScrollJornada(){
    if(this.jornadas.length == this.num_jornada) return;
    this.resetDataSub();
    this.is_loading_jornada = true;
    this.page_jornada += 1;
    this.data_sub = this.getJornadas()
      .subscribe({
        next:(p_jornada)=>{
          let {results} = p_jornada;
          this.jornadas = [...this.jornadas,...results];
          this.is_loading_jornada = false;
        }
      });
  }

  onSearchJornada(search:string){
    this.is_loading_jornada = true;
    this.search_jornada_subject.next(search);
  }

  private executeSearchJornada(){
    this.resetDataSub();
    this.page_jornada = 1;
    this.data_sub = this.getJornadas()
      .subscribe({
        next:(p_jornada)=>{
          let {results,count} = p_jornada;
          this.jornadas = [...results];
          this.num_jornada = count;
          this.is_loading_jornada = false;
        }
      })
  }

  private getModalidades(){
    let filters:{[key:string]:string|number} = {};
    if(this.search_modalidad && this.search_modalidad.length > 0) filters['modalidad_formacion'] = this.search_modalidad;
    return this.p04_service.getModalidades({filter:filters,page_number:this.page_jornada});
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
      P04DesercionesModel|
      PaginateModel<P04FichaModel>|
      PaginateModel<P04CentroFormacionModel>|
      PaginateModel<P04MunicipioModel>
    >[] = [
      this.getFichas(),
      this.getDeserciones()
    ];
    let obs_centros_formacion = this.getCentrosFormacion();
    let obs_municipios = this.getMunicipios();
    if(obs_centros_formacion) data_to_load = [...data_to_load,obs_centros_formacion];
    if(obs_municipios) data_to_load = [...data_to_load,obs_municipios];
    this.data_sub = forkJoin(data_to_load).subscribe({
        next:([p_fichas,deserciones,p_centro_formacion,p_municipio])=>{
          if(p_centro_formacion) {
            let {results:centros_formacion} = p_centro_formacion as PaginateModel<P04CentroFormacionModel>;
            this.centros = [...centros_formacion];
          };
          if(p_municipio) {
            let {results:municipios} = p_municipio as PaginateModel<P04MunicipioModel>;
            this.municipios = [...municipios];
          };
          this.deserciones = deserciones as P04DesercionesModel;
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
      this.centros = [];
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

  private getMunicipios(){
    if(!this.regional) {
      this.municipios = [];
      this.municipio = undefined;
      return undefined;
    };
    let filters:{[key:string]:string|number} = {'nombre_regional':this.regional};
    if(this.search_municipio && this.search_municipio.length > 0) filters['nombre_municipio_curso'] = this.search_municipio;
    return this.p04_service.getMunicipios({filter:filters,page_number:this.page_municipio});
  }

  onChangeMunicipio(){
    this.loadData();
  }

  onScrollMunicipio(){
    if(this.municipios.length == this.num_municipio) return;
    this.resetDataSub();
    this.is_loading_municipio = true;
    this.resetDataSub();
    this.page_municipio += 1;
    this.data_sub = this.getMunicipios()!
      .subscribe({
        next:(p_municipios)=>{
          let {results} = p_municipios;
          this.municipios = [...this.municipios,...results];
          this.is_loading_municipio = false;
        }
      });
  }

  onSearchMunicipio(search:string){
    this.is_loading_municipio = true;
    this.search_municipio_subject.next(search);
  }

  private executeSearchMunicipio(){
    this.resetDataSub();
    this.page_municipio = 1;
    this.data_sub = this.getMunicipios()!
      .subscribe({
        next:(p_municipio)=>{
          let {results,count} = p_municipio;
          this.municipios = [...results];
          this.num_municipio = count;
          this.is_loading_municipio = false;
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
      PaginateModel<P04FichaModel>|
      PaginateModel<P04ProgramaModel>
    >[] = [
      this.getFichas(),
    ];
    let obs_programas = this.getProgramas();
    if(obs_programas) data_to_load = [...data_to_load,obs_programas];
    this.data_sub = forkJoin(data_to_load).subscribe({
        next:([p_fichas,p_programa])=>{
          if(p_programa) {
            let {results:programas} = p_programa as PaginateModel<P04ProgramaModel>;
            this.programas = [...programas];
          };
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
          this.num_centro_formacion = count;
          this.is_loading_programa = false;
        }
      });
  }


  private loadData(){
    this.resetDataSub();
    this.data_sub = forkJoin([
      this.getFichas(),
      this.getDeserciones()
    ]).subscribe({
        next:([p_fichas,deserciones])=>{
          let {results,count} = p_fichas;
          this.fichas = [...results];
          this.numero_fichas = count;
          this.deserciones = deserciones;
        }
      });
  }

  private startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 1;

    this.search_jornada_sub = this.search_jornada_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_jornada = search;
          this.executeSearchJornada();
        }
      });
    
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

    this.search_municipio_sub = this.search_municipio_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_municipio = search;
          this.executeSearchMunicipio();
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
  }

  changePage(p_page:number){
    this.page_table = p_page;
    this.loadData();
  }

  sizeChange(){
    this.page_table = 1;
    this.loadData();
  }

  private resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

  private resetSearch(){
    if(this.search_jornada_sub) this.search_jornada_sub.unsubscribe();
    if(this.search_regional_sub) this.search_regional_sub.unsubscribe();
    if(this.search_centro_formacion_sub) this.search_centro_formacion_sub.unsubscribe();
    if(this.search_municipio_sub) this.search_municipio_sub.unsubscribe();
    if(this.search_modalidad_sub) this.search_modalidad_sub.unsubscribe();
  }

}
