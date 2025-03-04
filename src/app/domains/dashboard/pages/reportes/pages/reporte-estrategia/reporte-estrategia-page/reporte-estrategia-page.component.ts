import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BarCharNivelModalidadComponent } from '../components/bar-char-nivel-modalidad/bar-char-nivel-modalidad.component';
import { P04Service } from '@shared/services/documents/p04.service';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { forkJoin } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { KeyReportePipe } from '@shared/pipes/key-reporte.pipe';

@Component({
  selector: 'app-reporte-estrategia-page',
  standalone: true,
  imports: [
    CommonModule,
    BarCharNivelModalidadComponent,
    NzCardModule,
    KeyReportePipe
  ],
  templateUrl: './reporte-estrategia-page.component.html',
  styleUrl: './reporte-estrategia-page.component.css'
})
export class ReporteEstrategiaPageComponent  implements OnInit,OnDestroy{

  private p04_service = inject(P04Service);

  reporte:ReporteChartModel = {}
  metas:ReporteChartModel = {};

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    
  }

  get filters():{[key:string]:number|string}{
    return {};
  }

  get reportes_nivel(){
    return Object.entries(this.reporte).map(([nivel,value])=>({[nivel]:value}));
  }

  get metas_nivel(){
    return Object.entries(this.metas).map(([nivel,value])=>({[nivel]:value}));
  }
  
  get niveles(){
    return Object.keys(this.reporte);
  }

  private loadData(){
    forkJoin([
      this.getReporte(),
      this.getMetas()
    ])
      .subscribe({
        next:([reporte,metas])=>{
          this.reporte = {...reporte};
          this.metas = {...metas};          
        }
      });
  }

  private getReporte(){
    return this.p04_service.countAprendicesEstrategia({filter:this.filters});
  }

  private getMetas(){
    return this.p04_service.countMetasEstrategia({filter:this.filters});
  }
}
