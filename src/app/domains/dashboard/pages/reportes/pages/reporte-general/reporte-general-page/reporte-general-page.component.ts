import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { formatDateToString } from '@shared/functions/date.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { forkJoin, BehaviorSubject, Subscription, debounceTime, skip } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ColoresPorcentajeComponent } from '@shared/components/colores-porcentaje/colores-porcentaje.component';
import { BarCharGeneralComponent } from '../components/bar-char-general/bar-char-general.component';
import { KeysReportePipe } from '@shared/pipes/keys-reporte.pipe';
import { ValueReportePipe } from '@shared/pipes/value-reporte.pipe';
import { P04CentroFormacionModel } from '@shared/models/p04.model';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-reporte-general-page',
  standalone: true,
  imports: [
    CommonModule,
    NzDatePickerModule,
    BarCharGeneralComponent,
    NzTabsModule,
    FormsModule,
    NzCardModule,
    ColoresPorcentajeComponent,
    KeysReportePipe,
    ValueReportePipe,
    NzSelectModule,
    NzSpinModule
  ],
  templateUrl: './reporte-general-page.component.html',
  styleUrls: ['./reporte-general-page.component.css']
})
export class ReporteGeneralPageComponent implements OnInit, OnDestroy {

  private p04_service = inject(P04Service);

  // ========================
  // Variables generales
  // ========================
  tabs: string[] = ['titulada', 'complementaria'];
  tab_index: number = 0;

  grafica_titulada: ReporteChartModel = {};
  grafica_complementaria: ReporteChartModel = {};
  grafica_meta_titulada: ReporteChartModel = {};
  grafica_meta_complementaria: ReporteChartModel = {};

  reporte_titulada: ReporteChartModel = {};
  reporte_complementaria: ReporteChartModel = {};
  meta_titulada: ReporteChartModel = {};
  meta_complementaria: ReporteChartModel = {};

  fecha_fin?: Date = new Date(new Date().getFullYear(), 11, 31);
  fecha_inicio?: Date = new Date(new Date().getFullYear(), 0, 1);

  // ========================
  // Filtro y variables para Centro de Formación
  // ========================
  centro_formacion?: string;
  centros: P04CentroFormacionModel[] = [];
  page_centro: number = 1;
  num_centro: number = 0;
  is_loading_centro: boolean = false;
  search_centro?: string;
  search_centro_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  search_centro_sub?: Subscription;
  // ========================

  ngOnInit(): void {
    // Cargamos inicialmente los centros de formación y asignamos un valor por defecto
    forkJoin([this.getCentros()]).subscribe({
      next: ([centro_p]) => {
        const { results, count } = centro_p;
        this.centros = [...results];
        this.num_centro = count;
        this.is_loading_centro = false;
        if (this.centros.length) {
          this.centro_formacion = this.centros[0].nombre_centro;
        }
      },
      complete: () => {
        this.loadData();
        this.startSearch();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.search_centro_sub) {
      this.search_centro_sub.unsubscribe();
    }
  }

  // Actualiza el getter de filtros para incluir el centro de formación
  get filters(): { [key: string]: number | string } {
    let filters: { [key: string]: string | number } = {};
    if (this.centro_formacion) {
      filters['nombre_centro'] = this.centro_formacion;
    }
    if (this.fecha_inicio && this.fecha_fin) {
      filters['range_date:fecha_terminacion_ficha'] = `${formatDateToString(this.fecha_inicio)},${formatDateToString(this.fecha_fin)}`;
    }
    return filters;
  }

  get reportes_titulada() {
    return Object.entries(this.reporte_titulada).map(([nivel, value]) => ({ [nivel]: value }));
  }

  get reportes_complementaria() {
    return Object.entries(this.reporte_complementaria).map(([nivel, value]) => ({ [nivel]: value }));
  }

  get metas_titulada() {
    return Object.entries(this.meta_titulada).map(([nivel, value]) => ({ [nivel]: value }));
  }

  get metas_complementaria() {
    return Object.entries(this.meta_complementaria).map(([nivel, value]) => ({ [nivel]: value }));
  }

  get niveles_titulada() {
    return Object.keys(this.reporte_titulada);
  }

  get niveles_complementaria() {
    return Object.keys(this.reporte_complementaria);
  }

  get modalidades_titulada() {
    if (!this.reportes_titulada.at(0)) return [];
    const nivel = Object.keys(this.reportes_titulada.at(0)!)[0]!;
    const reporte = this.reportes_titulada.at(0)!;
    return Object.keys(reporte[nivel]);
  }

  get modalidades_complementaria() {
    if (!this.reportes_complementaria.at(0)) return [];
    const nivel = Object.keys(this.reportes_complementaria.at(0)!)[0]!;
    const reporte = this.reportes_complementaria.at(0)!;
    return Object.keys(reporte[nivel]);
  }

  onChangeInicio(): void {
    this.loadData();
  }

  onChangeFin(): void {
    this.loadData();
  }

  // ========================
  // Funciones para cargar reportes y metas
  // ========================
  private getReporte() {
    return this.p04_service.countAprendicesEstrategia({ filter: this.filters });
  }

  private getMetas() {
    return this.p04_service.countMetasEstrategia({ filter: this.filters });
  }

  private loadData() {
    forkJoin([this.getReporte(), this.getMetas()]).subscribe({
      next: ([reporte, metas]) => {
        const { titulada: t_reporte, complementaria: c_reporte } = this.divideReporte(reporte);
        const { titulada: t_meta, complementaria: c_meta } = this.divideReporte(metas);
        this.reporte_titulada = { ...t_reporte };
        this.reporte_complementaria = { ...c_reporte };
        this.meta_titulada = { ...t_meta };
        this.meta_complementaria = { ...c_meta };
        this.grafica_titulada = { ...this.formatToGrafica(t_reporte) };
        this.grafica_complementaria = { ...this.formatToGrafica(c_reporte) };
        this.grafica_meta_titulada = { ...this.formatToGrafica(t_meta) };
        this.grafica_meta_complementaria = { ...this.formatToGrafica(c_meta) };
      }
    });
  }

  private divideReporte(reporte: ReporteChartModel) {
    let titulada: ReporteChartModel = { ...reporte };
    let complementaria: ReporteChartModel = { ...reporte };
    Object.keys(reporte).forEach((k) => {
      if (k.split(' ').at(-1) === 'BILINGÜISMO') {
        delete titulada[k];
      } else {
        delete complementaria[k];
      }
    });
    return { titulada, complementaria };
  }

  private formatToGrafica(reporte: ReporteChartModel) {
    let grafica: ReporteChartModel = {};
    Object.keys(reporte).forEach((i) => {
      const r = reporte[i] as ReporteChartModel;
      Object.keys(r).forEach((j) => {
        const key = `${i} ${j}`;
        grafica = { ...grafica, [key]: r[j] };
      });
    });
    return grafica;
  }
  // ========================
  // Fin funciones de reportes y metas
  // ========================

  // ===============================================
  // Funciones para el filtro de Centro de Formación
  // ===============================================
  private getCentros() {
    const filters: { [key: string]: string | number } = {};
    if (this.search_centro && this.search_centro.length > 0) {
      filters['nombre_centro'] = this.search_centro;
    }
    return this.p04_service.getCentrosFormacion({ filter: filters, page_number: this.page_centro });
  }

  onChangeCentro(): void {
    // Al cambiar el centro se actualiza el filtro y se recargan los datos
    this.loadData();
  }

  onSearchCentros(search: string): void {
    this.is_loading_centro = true;
    this.search_centro_subject.next(search);
  }

  private executeSearchCentros(): void {
    this.page_centro = 1;
    this.getCentros().subscribe({
      next: (p_centros) => {
        const { results, count } = p_centros;
        this.centros = [...results];
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  onScrollCentros(): void {
    if (this.centros.length === this.num_centro) return;
    this.is_loading_centro = true;
    this.page_centro++;
    this.getCentros().subscribe({
      next: (p_centros) => {
        const { results, count } = p_centros;
        this.centros = [...this.centros, ...results];
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  private startSearch(): void {
    const search_wait: number = 200;
    const search_skip: number = 1;
    this.search_centro_sub = this.search_centro_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({
        next: (search) => {
          this.search_centro = search;
          this.executeSearchCentros();
        }
      });
  }
  // ===============================================
}
