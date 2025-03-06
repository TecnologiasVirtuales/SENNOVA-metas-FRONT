import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { formatDateToString } from '@shared/functions/date.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { P04Service } from '@shared/services/documents/p04.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reporte-general-page',
  standalone: true,
  imports: [
    CommonModule,
    NzDatePickerModule,
  ],
  templateUrl: './reporte-general-page.component.html',
  styleUrl: './reporte-general-page.component.css'
})
export class ReporteGeneralPageComponent implements OnInit{

  private p04_service = inject(P04Service);

  fecha_inicio?:Date;
  fecha_fin?:Date;

  ngOnInit(): void {
    forkJoin([
      this.getReporte(),
      this.getMetas()
    ]).subscribe({
      next:([reporte,metas])=>{
        let {titulada:t_reporte,complementaria:c_reporte} = this.divideReporte(reporte);
        let {titulada:t_meta,complementaria:c_meta} = this.divideReporte(metas);
        let t_reporte_g = this.formatToGrafica(t_reporte);
        console.log(t_reporte_g);
      }
    });
  }

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.fecha_inicio) filters['fecha_inicio_ficha'] = formatDateToString(this.fecha_inicio);
    if(this.fecha_fin) filters['fecha_terminacion_ficha'] = formatDateToString(this.fecha_fin);
    return filters;
  }

  private getReporte(){
    return this.p04_service.countAprendicesEstrategia();
  }

  private getMetas(){
    return this.p04_service.countMetasEstrategia();
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
