import { Pipe, PipeTransform } from '@angular/core';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Pipe({
  name: 'valueReporte',
  standalone: true
})
export class ValueReportePipe implements PipeTransform {

  transform(reportes: ReporteChartModel[],nivel:string,modalidad:string): number {
    let index = reportes.findIndex(r=>Object.keys(r).some(k=>k==nivel));
    let reporte_nivel = reportes[index][nivel] as ReporteChartModel;
    let reporte_modalidad = reporte_nivel[modalidad];    
    return reporte_modalidad as number;
  }

}
