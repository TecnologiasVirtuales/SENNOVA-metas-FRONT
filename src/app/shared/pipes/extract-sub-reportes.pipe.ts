import { Pipe, PipeTransform } from '@angular/core';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Pipe({
  name: 'extractSubReportes',
  standalone: true
})
export class ExtractSubReportesPipe implements PipeTransform {

  transform(reporte:ReporteChartModel,reporte_meta:ReporteChartModel) {
    return Object.keys(reporte).map((k)=>{
      return {
        nivel:k,
        reporte:reporte[k] as ReporteChartModel,
        reporte_meta:reporte_meta[k] as ReporteChartModel
      }
    });
  }

}
