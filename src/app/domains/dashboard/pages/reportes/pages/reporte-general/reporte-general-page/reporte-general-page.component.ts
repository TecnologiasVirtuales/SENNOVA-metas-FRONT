import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { formatDateToString } from '@shared/functions/date.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ColoresPorcentajeComponent } from '@shared/components/colores-porcentaje/colores-porcentaje.component';
import { BarCharGeneralComponent } from '../components/bar-char-general/bar-char-general.component';
import { KeysReportePipe } from '@shared/pipes/keys-reporte.pipe';
import { ValueReportePipe } from '@shared/pipes/value-reporte.pipe';

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
    ValueReportePipe
  ],
  templateUrl: './reporte-general-page.component.html',
  styleUrl: './reporte-general-page.component.css'
})
export class ReporteGeneralPageComponent implements OnInit{

  private p04_service = inject(P04Service);

  tabs:string[] = [
    'titulada',
    'complementaria'
  ];
  tab_index:number = 0;

  grafica_titulada:ReporteChartModel = {};
  grafica_complementaria:ReporteChartModel = {};
  grafica_meta_titulada:ReporteChartModel = {};
  grafica_meta_complementaria:ReporteChartModel = {};

  reporte_titulada:ReporteChartModel = {};
  reporte_complementaria:ReporteChartModel = {};
  meta_titulada:ReporteChartModel = {};
  meta_complementaria:ReporteChartModel = {};

  fecha_inicio?:Date;
  fecha_fin?:Date;

  ngOnInit(): void {
    this.loadData();
  }

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.fecha_inicio) filters['fecha_inicio_ficha'] = formatDateToString(this.fecha_inicio);
    if(this.fecha_fin) filters['fecha_terminacion_ficha'] = formatDateToString(this.fecha_fin);
    return filters;
  }

  get reportes_titulada(){
    return Object.entries(this.reporte_titulada).map(([nivel,value])=>({[nivel]:value}));
  }

  get reportes_complementaria(){
    return Object.entries(this.reporte_complementaria).map(([nivel,value])=>({[nivel]:value}));
  }

  get metas_titulada(){
    return Object.entries(this.meta_titulada).map(([nivel,value])=>({[nivel]:value}));
  }

  get metas_complementaria(){
    return Object.entries(this.meta_complementaria).map(([nivel,value])=>({[nivel]:value}));
  }

  get niveles_titulada(){
    return Object.keys(this.reporte_titulada);
  }

  get niveles_complementaria(){
    return Object.keys(this.reporte_complementaria);
  }

  get modalidades_titulada(){
    if(!this.reportes_titulada.at(0)) return [];
    let nivel = Object.keys(this.reportes_titulada.at(0)!)[0]!;
    let reporte = this.reportes_titulada.at(0)!;
    return Object.keys(reporte[nivel]);
  }

  get modalidades_complementaria(){
    if(!this.reportes_complementaria.at(0)) return [];
    let nivel = Object.keys(this.reportes_complementaria.at(0)!)[0]!;
    let reporte = this.reportes_complementaria.at(0)!;
    return Object.keys(reporte[nivel]);
  }

  private getReporte(){
    return this.p04_service.countAprendicesEstrategia();
  }

  private getMetas(){
    return this.p04_service.countMetasEstrategia();
  }

  private loadData(){
    forkJoin([
      this.getReporte(),
      this.getMetas()
    ]).subscribe({
      next:([reporte,metas])=>{
        let {titulada:t_reporte,complementaria:c_reporte} = this.divideReporte(reporte);
        let {titulada:t_meta,complementaria:c_meta} = this.divideReporte(metas);
        this.reporte_titulada = {...t_reporte};
        this.reporte_complementaria = {...c_reporte};
        this.meta_titulada = {...t_meta},
        this.meta_complementaria = {...c_meta};
        this.grafica_titulada = {...this.formatToGrafica(t_reporte)};
        this.grafica_complementaria = {...this.formatToGrafica(c_reporte)};
        this.grafica_meta_titulada = {...this.formatToGrafica(t_meta)};
        this.grafica_meta_complementaria = {...this.formatToGrafica(c_meta)};
      }
    });
  }

  private divideReporte(reporte:ReporteChartModel){
    let titulada:ReporteChartModel = {...reporte};
    let complementaria:ReporteChartModel = {...reporte};
    Object.keys(reporte).map((k)=>{
      if (k.split(' ').at(-1) === 'BILINGÜISMO') {
        delete titulada[k];
      } else {
        delete complementaria[k];
      }
    });
    return {titulada, complementaria};
  }
  private formatToGrafica(reporte:ReporteChartModel){
    let grafica:ReporteChartModel = {}
    Object.keys(reporte).forEach((i)=>{
      let r = reporte[i] as ReporteChartModel;
      Object.keys(r).forEach((j)=>{
        let key = `${i} ${j}`;
        grafica = {...grafica,[key]:r[j]}
      });
    })
    return grafica;
  }

}
