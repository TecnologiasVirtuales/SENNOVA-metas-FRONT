import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BarCharNivelModalidadComponent } from '../components/bar-char-nivel-modalidad/bar-char-nivel-modalidad.component';
import { P04Service } from '@shared/services/documents/p04.service';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Component({
  selector: 'app-reporte-estrategia-page',
  standalone: true,
  imports: [
    CommonModule,
    BarCharNivelModalidadComponent
  ],
  templateUrl: './reporte-estrategia-page.component.html',
  styleUrl: './reporte-estrategia-page.component.css'
})
export class ReporteEstrategiaPageComponent  implements OnInit,OnDestroy{

  private p04_service = inject(P04Service);

  reporte:ReporteChartModel = {}

  ngOnInit(): void {
    this.getReporte()
      .subscribe({
        next:(reporte)=>{
          this.reporte = {...reporte};
          console.log(reporte);
          
          console.log(this.reportes_nivel);
          
        }
      });
  }

  ngOnDestroy(): void {
    
  }

  get filters():{[key:string]:number|string}{
    return {};
  }

  get reportes_nivel(){
    return Object.entries(this.reporte).map(([nivel,value])=>({[nivel]:value}));
  }
  get niveles(){
    return Object.keys(this.reporte);
  }

  private getReporte(){
    return this.p04_service.countAprendicesEstrategia({filter:this.filters});
  }
}
