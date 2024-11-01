import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FichasByModalidadModel } from '@shared/models/fichas-by-nivel-modalidad.model';
import { ReportesService } from '@shared/services/reportes.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import {
  ChartComponent,
} from "ng-apexcharts";
import { ChartOptions } from '@shared/types/chart-options.type';
import { MapColombiaComponent } from '@shared/components/map-colombia/map-colombia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzFlexModule,
    ChartComponent,
    MapColombiaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private reporte_service = inject(ReportesService);

  private data_sub: Subscription | null = null;

  @ViewChild('chart') chart: ChartComponent = {} as ChartComponent;

  chart_options: Partial<ChartOptions>|null = null;

  fichas_by_nivel_modalidad: FichasByModalidadModel = {}

  modalidades_matriz: string[] = [];
  niveles_matriz: string[] = [];
  chart_data:number[] = [];
  chart_colors:string[] = [];
  chart_labels:string[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.data_sub = this.reporte_service.fichasByNivelModalidad()
      .subscribe({
        next: (data) => {
          this.fichas_by_nivel_modalidad = { ...data };
          this.configChart();
          this.niveles_matriz = Object.keys(this.fichas_by_nivel_modalidad);
          this.modalidades_matriz = Object.keys(this.fichas_by_nivel_modalidad[this.niveles_matriz[0]]);
        }
      });
  }

  ngOnDestroy(): void {
    this.data_sub!.unsubscribe();
  }

  configChart() {
    this.loadChartData();
    this.chart_options = {
      series: [
        {
          name: 'aprendices',
          data: this.chart_data
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        zoom:{enabled:true},
        events: {
          click: (chart, w, e) => {
            console.log('chart', chart);
            console.log('w', w);
            console.log('e', e);
          }
        }
      },
      colors:this.chart_colors,
      plot_options:{
        bar:{
          distributed:true,
        }
      },
      data_labels: {
        enabled: false
      },
      grid: {
        show: true
      },
      legend:{
        show:false
      },
      xaxis: {
        categories: this.chart_labels,
        labels: {
          style: {
            colors: this.chart_colors,
            fontSize: '0.7rem',
          }
        }
      }
    }    
  }

  loadChartData() {
    let labels: string[] = [];
    let data: number[] = [];
    let colors: string[] = [];
    Object.keys(this.fichas_by_nivel_modalidad)
      .forEach((nivel) => {
        Object.keys(this.fichas_by_nivel_modalidad[nivel])
          .forEach((modalidad) => {
            const {inscritos,retirados} = this.fichas_by_nivel_modalidad[nivel][modalidad];
            colors.push(this.calcColor(inscritos,retirados));
            data.push(inscritos);
            labels.push(`${nivel}-${modalidad}`)
          });
      });    
    this.chart_colors = [...colors];
    this.chart_data = [...data];
    this.chart_labels = [...labels];
  }

  calcColor(inscritos:number,retirados:number){
    let activos = inscritos-retirados;
    if(activos === 0){
      return '#FF0000';
    }
    let porcentaje = (activos/inscritos)*100;
    if(porcentaje>=60){
      return '#008000'
    }

    if(porcentaje>=50){
      return '#FFFF00';
    }

    if(porcentaje>=30){
      return '#FFA500';
    }

    return '#FF0000';
  }
}
