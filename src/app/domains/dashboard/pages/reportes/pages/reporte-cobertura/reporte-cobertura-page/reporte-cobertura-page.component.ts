import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, Subscription, skip, debounceTime } from 'rxjs';
import { P04CentroFormacionModel, P04DepartamentoModel, P04ModalidadModel, P04MunicipioModel, P04NivelModel, P04ProgramaModel, P04RegionalModel } from '@shared/models/p04.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { formatDateToString } from '@shared/functions/date.functions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ColombiaMapComponent } from '@shared/components/colombia-map/colombia-map.component';
import { lucideGlobe } from '@ng-icons/lucide';

@Component({
  selector: 'app-reporte-cobertura-page',
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
    ColombiaMapComponent
  ],
  templateUrl: './reporte-cobertura-page.component.html',
  styleUrls: ['./reporte-cobertura-page.component.css'],
  viewProviders: [provideIcons({ lucideGlobe })]
})
export class ReporteCoberturaPageComponent implements OnInit, OnDestroy {

  private data_sub?: Subscription;

  // Filtros principales
  regional?: string;
  centro_formacion?: string;
  departamento?: string;
  municipio?: string;
  nivel_formacion?: string;
  modalidad?: string;
  programa?: string;
  fecha_fin?:Date = new Date(new Date().getFullYear(),11,31);
  fecha_inicio?:Date = new Date(new Date().getFullYear(),0,1);

  // Datos de la tabla y selects dependientes
  programas: P04ProgramaModel[] = [];
  programas_select: P04ProgramaModel[] = [];
  niveles: P04NivelModel[] = [];
  regionales: P04RegionalModel[] = [];
  departamentos: P04DepartamentoModel[] = [];
  centros: P04CentroFormacionModel[] = [];
  municipios: P04MunicipioModel[] = [];
  modalidades: P04ModalidadModel[] = [];

  // Paginación
  page_table: number = 1;
  page_size: number = 5;
  page_programa: number = 1;
  num_programa: number = 0;
  page_nivel: number = 1;
  num_nivel: number = 0;
  page_regional: number = 1;
  num_regional: number = 0;
  page_departamento: number = 1;
  num_departamento: number = 0;
  page_centro: number = 1;
  num_centro: number = 0;
  page_municipio: number = 1;
  num_municipio: number = 0;
  page_modalidad: number = 1;
  num_modalidad: number = 0;

  // Flags de carga
  is_loading_programa: boolean = false;
  is_loading_nivel: boolean = false;
  is_loading_regional: boolean = false;
  is_loading_departamento: boolean = false;
  is_loading_centro: boolean = false;
  is_loading_municipio: boolean = false;
  is_loading_modalidad: boolean = false;

  // Subjects para búsqueda
  search_programa?: string;
  search_nivel?: string;
  search_regional?: string;
  search_departamento?: string;
  search_centro?: string;
  search_municipio?: string;
  search_modalidad?: string;

  search_programa_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_nivel_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_regional_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_departamento_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_centro_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_municipio_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_modalidad_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  search_programa_sub?: Subscription;
  search_nivel_sub?: Subscription;
  search_regional_sub?: Subscription;
  search_departamento_sub?: Subscription;
  search_centro_sub?: Subscription;
  search_municipio_sub?: Subscription;
  search_modalidad_sub?: Subscription;

  constructor(private p04_service: P04Service) {}

  get filters(): { [key: string]: number | string } {
    let filters: { [key: string]: string | number } = {};
    if (this.regional) filters['nombre_regional'] = this.regional;
    if (this.centro_formacion) filters['nombre_centro'] = this.centro_formacion;
    if (this.departamento) filters['nombre_departamento_curso'] = this.departamento;
    if (this.municipio) filters['nombre_municipio_curso'] = this.municipio;
    if (this.nivel_formacion) filters['nivel_formacion'] = this.nivel_formacion;
    if (this.modalidad) filters['modalidad_formacion'] = this.modalidad;
    if (this.programa) filters['nombre_programa_formacion'] = this.programa;
    if(this.fecha_inicio && this.fecha_fin) filters['range_date:fecha_terminacion_ficha'] = `${formatDateToString(this.fecha_inicio)},${formatDateToString(this.fecha_fin)}`
    return filters;
  }

  ngOnInit(): void {
    forkJoin([
      this.getProgramasTabla(),
      this.getNiveles(),
      this.getRegionales(),
      this.getDepartamentos(),
      this.getModalidades()
    ]).subscribe({
      next: ([p_programas, p_niveles, p_regionales, p_departamentos, p_modalidades]) => {
        const { results: prog, count: count_prog } = p_programas;
        this.programas = [...prog];
        this.num_programa = count_prog;
        const { results: niv, count: count_niv } = p_niveles;
        this.niveles = [...niv];
        this.num_nivel = count_niv;
        const { results: reg, count: count_reg } = p_regionales;
        this.regionales = [...reg];
        this.num_regional = count_reg;
        const { results: deps, count: count_dep } = p_departamentos;
        this.departamentos = [...deps];
        this.num_departamento = count_dep;
        const { results: mod, count: count_mod } = p_modalidades;
        this.modalidades = [...mod];
        this.num_modalidad = count_mod;
      }
    });
    this.startSearch();
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

  onSelectDepartamento(departamento: string): void {
    this.departamento = departamento;
    this.loadData();
  }

  onSelectMunicipio(municipio: string): void {
    this.municipio = municipio;
    this.loadData();
  }

  onResetMap(): void {
    this.departamento = undefined;
    this.municipio = undefined;
    this.loadData();
  }

  changePage(p_page: number): void {
    this.page_table = p_page;
    this.loadData();
  }

  onChangePrograma(): void {
    this.loadData();
  }

  onChangeCentro(): void {
    this.loadData();
  }

  private getProgramasTabla() {
    return this.p04_service.getProgramas({
      filter: this.filters,
      page_number: this.page_table,
      page_size: this.page_size
    });
  }

  private getNiveles() {
    let filters: { [key: string]: string | number } = {};
    if (this.search_nivel && this.search_nivel.length > 0)
      filters['nivel_formacion'] = this.search_nivel;
    return this.p04_service.getNiveles({ filter: filters, page_number: this.page_nivel });
  }

  private getRegionales() {
    let filters: { [key: string]: string | number } = {};
    if (this.search_regional && this.search_regional.length > 0)
      filters['nombre_regional'] = this.search_regional;
    return this.p04_service.getRegionales({ filter: filters, page_number: this.page_regional });
  }

  private getDepartamentos() {
    let filters: { [key: string]: string | number } = {};
    if (this.search_departamento && this.search_departamento.length > 0)
      filters['nombre_departamento'] = this.search_departamento;
    return this.p04_service.getDepartamentos({ filter: filters, page_number: this.page_departamento });
  }

  private getModalidades() {
    let filters: { [key: string]: string | number } = {};
    if (this.search_modalidad && this.search_modalidad.length > 0)
      filters['modalidad_formacion'] = this.search_modalidad;
    return this.p04_service.getModalidades({ filter: filters, page_number: this.page_modalidad });
  }

  private getProgramasSelect() {
    if (!this.nivel_formacion) {
      this.programas_select = [];
      this.programa = undefined;
      return this.p04_service.getProgramas({ filter: { nivel_formacion: '' }, page_number: this.page_programa });
    }
    let filters: { [key: string]: string | number } = { nivel_formacion: this.nivel_formacion };
    if (this.search_programa && this.search_programa.length > 0)
      filters['nombre_programa_formacion'] = this.search_programa;
    return this.p04_service.getProgramas({ filter: filters, page_number: this.page_programa });
  }

  private getCentros() {
    if (!this.regional) {
      this.centros = [];
      this.centro_formacion = undefined;
      return this.p04_service.getCentrosFormacion({ filter: { nombre_regional: '' }, page_number: this.page_centro });
    }
    let filters: { [key: string]: string | number } = { nombre_regional: this.regional };
    if (this.search_centro && this.search_centro.length > 0)
      filters['nombre_centro'] = this.search_centro;
    return this.p04_service.getCentrosFormacion({ filter: filters, page_number: this.page_centro });
  }

  private getMunicipios() {
    if (!this.departamento) {
      this.municipios = [];
      this.municipio = undefined;
      return this.p04_service.getMunicipios({ filter: { nombre_departamento_curso: '' }, page_number: this.page_municipio });
    }
    let filters: { [key: string]: string | number } = { nombre_departamento_curso: this.departamento };
    if (this.search_municipio && this.search_municipio.length > 0)
      filters['nombre_municipio_curso'] = this.search_municipio;
    return this.p04_service.getMunicipios({ filter: filters, page_number: this.page_municipio });
  }

  onChangeNivel(): void {
    this.resetDataSub();
    this.data_sub = this.getProgramasSelect().subscribe({
      next: (p_prog_select) => {
        const { results, count } = p_prog_select;
        this.programas_select = [...results];
        this.num_programa = count;
      }
    });
    this.loadData();
  }

  onChangeRegional(): void {
    this.centro_formacion = undefined;
    this.resetDataSub();
    const obs = this.getCentros();
    if (obs) {
      this.data_sub = obs.subscribe({
        next: (p_centros) => {
          const { results, count } = p_centros;
          this.centros = [...results];
          this.num_centro = count;
        }
      });
    }
    this.loadData();
  }

  onChangeDepartamento(): void {
    this.municipio = undefined;
    this.resetDataSub();
    this.data_sub = this.getMunicipios().subscribe({
      next: (p_municipios) => {
        const { results, count } = p_municipios;
        this.municipios = [...results];
        this.num_municipio = count;
      }
    });
    this.loadData();
  }

  sizeChange(){
    this.page_table = 1;
    this.loadData();
  }

  onChangeMunicipio(): void {
    this.loadData();
  }
  
  onChangeModalidad(): void {
    this.loadData();
  }

  onScrollRegionales(): void {
    if (this.regionales.length === this.num_regional) return;
    this.is_loading_regional = true;
    this.page_regional += 1;
    this.resetDataSub();
    this.data_sub = this.getRegionales().subscribe({
      next: (p_regionales) => {
        const { results, count } = p_regionales;
        this.regionales = [...this.regionales, ...results];
        this.num_regional = count;
        this.is_loading_regional = false;
      }
    });
  }

  onScrollCentros(): void {
    if (!this.regional) return;
    if (this.centros.length === this.num_centro) return;
    this.is_loading_centro = true;
    this.page_centro += 1;
    this.resetDataSub();
    this.getCentros()?.subscribe({
      next: (p_centros) => {
        const { results, count } = p_centros;
        this.centros = [...this.centros, ...results];
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  onScrollDepartamentos(): void {
    if (this.departamentos.length === this.num_departamento) return;
    this.is_loading_departamento = true;
    this.page_departamento += 1;
    this.resetDataSub();
    this.data_sub = this.getDepartamentos().subscribe({
      next: (p_departamentos) => {
        const { results, count } = p_departamentos;
        this.departamentos = [...this.departamentos, ...results];
        this.num_departamento = count;
        this.is_loading_departamento = false;
      }
    });
  }

  onScrollMunicipios(): void {
    if (this.municipios.length === this.num_municipio) return;
    this.is_loading_municipio = true;
    this.page_municipio += 1;
    this.resetDataSub();
    this.data_sub = this.getMunicipios().subscribe({
      next: (p_municipios) => {
        const { results, count } = p_municipios;
        this.municipios = [...this.municipios, ...results];
        this.num_municipio = count;
        this.is_loading_municipio = false;
      }
    });
  }

  onScrollNiveles(): void {
    if (this.niveles.length === this.num_nivel) return;
    this.is_loading_nivel = true;
    this.page_nivel += 1;
    this.resetDataSub();
    this.data_sub = this.getNiveles().subscribe({
      next: (p_niveles) => {
        const { results, count } = p_niveles;
        this.niveles = [...this.niveles, ...results];
        this.num_nivel = count;
        this.is_loading_nivel = false;
      }
    });
  }

  onScrollProgramasSelect(): void {
    if (this.programas_select.length === this.num_programa) return;
    this.is_loading_programa = true;
    this.page_programa += 1;
    this.resetDataSub();
    this.data_sub = this.getProgramasSelect().subscribe({
      next: (p_prog_select) => {
        const { results, count } = p_prog_select;
        this.programas_select = [...this.programas_select, ...results];
        this.num_programa = count;
        this.is_loading_programa = false;
      }
    });
  }

  onScrollModalidades(): void {
    if (this.modalidades.length === this.num_modalidad) return;
    this.is_loading_modalidad = true;
    this.page_modalidad += 1;
    this.resetDataSub();
    this.data_sub = this.getModalidades().subscribe({
      next: (p_modalidades) => {
        const { results, count } = p_modalidades;
        this.modalidades = [...this.modalidades, ...results];
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
  }

  onSearchRegionales(search: string): void {
    this.is_loading_regional = true;
    this.search_regional_subject.next(search);
  }

  onSearchCentros(search: string): void {
    this.is_loading_centro = true;
    this.search_centro_subject.next(search);
  }

  onSearchDepartamentos(search: string): void {
    this.is_loading_departamento = true;
    this.search_departamento_subject.next(search);
  }

  onSearchMunicipios(search: string): void {
    this.is_loading_municipio = true;
    this.search_municipio_subject.next(search);
  }

  onSearchNiveles(search: string): void {
    this.is_loading_nivel = true;
    this.search_nivel_subject.next(search);
  }

  onSearchProgramas(search: string): void {
    this.is_loading_programa = true;
    this.search_programa_subject.next(search);
  }
  
  onSearchModalidades(search: string): void {
    this.is_loading_modalidad = true;
    this.search_modalidad_subject.next(search);
  }

  private executeSearchRegionales(): void {
    this.page_regional = 1;
    this.getRegionales().subscribe({
      next: (p_regionales) => {
        const { results, count } = p_regionales;
        this.regionales = [...results];
        this.num_regional = count;
        this.is_loading_regional = false;
      }
    });
  }

  private executeSearchCentros(): void {
    if (!this.regional) return;
    this.page_centro = 1;
    this.getCentros()?.subscribe({
      next: (p_centros) => {
        const { results, count } = p_centros;
        this.centros = [...results];
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  private executeSearchDepartamentos(): void {
    this.page_departamento = 1;
    this.getDepartamentos().subscribe({
      next: (p_departamentos) => {
        const { results, count } = p_departamentos;
        this.departamentos = [...results];
        this.num_departamento = count;
        this.is_loading_departamento = false;
      }
    });
  }

  private executeSearchMunicipios(): void {
    this.page_municipio = 1;
    this.getMunicipios().subscribe({
      next: (p_municipios) => {
        const { results, count } = p_municipios;
        this.municipios = [...results];
        this.num_municipio = count;
        this.is_loading_municipio = false;
      }
    });
  }

  private executeSearchNiveles(): void {
    this.page_nivel = 1;
    this.getNiveles().subscribe({
      next: (p_niveles) => {
        const { results, count } = p_niveles;
        this.niveles = [...results];
        this.num_nivel = count;
        this.is_loading_nivel = false;
      }
    });
  }

  private executeSearchProgramas(): void {
    this.page_programa = 1;
    this.getProgramasSelect().subscribe({
      next: (p_prog_select) => {
        const { results, count } = p_prog_select;
        this.programas_select = [...results];
        this.num_programa = count;
        this.loadData();
        this.is_loading_programa = false;
      }
    });
  }
  
  private executeSearchModalidades(): void {
    this.page_modalidad = 1;
    this.getModalidades().subscribe({
      next: (p_modalidades) => {
        const { results, count } = p_modalidades;
        this.modalidades = [...results];
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
  }

  private startSearch(): void {
    const search_wait = 200;
    const search_skip = 1;
    this.search_regional_sub = this.search_regional_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_regional = search; this.executeSearchRegionales(); } });
    this.search_centro_sub = this.search_centro_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_centro = search; this.executeSearchCentros(); } });
    this.search_departamento_sub = this.search_departamento_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_departamento = search; this.executeSearchDepartamentos(); } });
    this.search_municipio_sub = this.search_municipio_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_municipio = search; this.executeSearchMunicipios(); } });
    this.search_nivel_sub = this.search_nivel_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_nivel = search; this.executeSearchNiveles(); } });
    this.search_programa_sub = this.search_programa_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_programa = search; this.executeSearchProgramas(); } });
    this.search_modalidad_sub = this.search_modalidad_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({ next: (search) => { this.search_modalidad = search; this.executeSearchModalidades(); } });
  }

  private resetDataSub(): void {
    if (this.data_sub) this.data_sub.unsubscribe();
  }

  private resetSearch(): void {
    if (this.search_regional_sub) this.search_regional_sub.unsubscribe();
    if (this.search_centro_sub) this.search_centro_sub.unsubscribe();
    if (this.search_departamento_sub) this.search_departamento_sub.unsubscribe();
    if (this.search_municipio_sub) this.search_municipio_sub.unsubscribe();
    if (this.search_nivel_sub) this.search_nivel_sub.unsubscribe();
    if (this.search_programa_sub) this.search_programa_sub.unsubscribe();
    if (this.search_modalidad_sub) this.search_modalidad_sub.unsubscribe();
  }

  private loadData() {
    this.resetDataSub();
    this.data_sub = this.getProgramasTabla().subscribe({
      next: (p_programa) => {
        const { results, count } = p_programa;
        this.programas = [...results];
        this.num_programa = count;
      }
    });
  }
}
