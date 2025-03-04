import { Pipe, PipeTransform } from '@angular/core';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Pipe({
  name: 'keyReporte',
  standalone: true
})
export class KeyReportePipe implements PipeTransform {

  transform(reporte: ReporteChartModel): string {
    return Object.keys(reporte).at(0)!;
  }

}
