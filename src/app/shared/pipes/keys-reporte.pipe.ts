import { Pipe, PipeTransform } from '@angular/core';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Pipe({
  name: 'keysReporte',
  standalone: true
})
export class KeysReportePipe implements PipeTransform {

  transform(reporte: ReporteChartModel): string[] {
    return Object.keys(reporte);
  }

}
