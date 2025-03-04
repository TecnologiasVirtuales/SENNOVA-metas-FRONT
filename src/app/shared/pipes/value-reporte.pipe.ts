import { Pipe, PipeTransform } from '@angular/core';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Pipe({
  name: 'valueReporte',
  standalone: true
})
export class ValueReportePipe implements PipeTransform {

  transform(reporte: ReporteChartModel,nivel:string,modalidad:string): unknown {
    let reporte_nivel = reporte[nivel] as ReporteChartModel;
    let reporte_modalidad = reporte_nivel[modalidad];
    return reporte_modalidad as number;
  }

}
