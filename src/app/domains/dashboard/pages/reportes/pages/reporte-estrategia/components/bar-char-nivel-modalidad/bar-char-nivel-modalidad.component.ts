import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { getColorsForLevel } from '@shared/functions/colors.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { ChartOptions } from '@shared/types/chart-options.type';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-bar-char-nivel-modalidad',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NzCardComponent
  ],
  templateUrl: './bar-char-nivel-modalidad.component.html',
  styleUrl: './bar-char-nivel-modalidad.component.css'
})
export class BarCharNivelModalidadComponent implements OnInit{
  @Input({required:true}) reporte_nivel:ReporteChartModel = {} as ReporteChartModel;
  @Input({required:true}) meta_nivel:ReporteChartModel = {} as ReporteChartModel;

  chart_options?:Partial<ChartOptions>;

  ngOnInit(): void {
    this.setChartData();
  }

  get nivel() {
    return Object.keys(this.reporte_nivel).at(0)!;
  }

  get modalidades(){
    return Object.keys(this.reporte_modalidades);
  }

  get reporte_modalidades(){
    return this.reporte_nivel[this.nivel] as ReporteChartModel;
  }

  get metas_nivel(){
    return this.meta_nivel[this.nivel] as ReporteChartModel;
  }

  get reporte_series(){
    return Object.keys(this.reporte_modalidades).map((k)=>this.reporte_modalidades[k] as number);
  }

  get meta_series(){
    return Object.keys(this.metas_nivel).map((k)=>this.metas_nivel[k] as number);
  }

  setChartData(){
    console.log(this.modalidades.map((m)=>[m]));
    
    this.chart_options = {
      series:[
        {
          name:"aprendices",
          data:this.reporte_series
        },
        {
          name:"meta",
          data:this.meta_series
        }
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: getColorsForLevel(this.reporte_modalidades,this.metas_nivel,false),
      plot_options: {
        bar: {
          columnWidth: '80%',
          distributed: true
        },
      },
      data_labels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid:{
        show: true,
      },
      xaxis: {
        categories: this.modalidades.map((m)=>[m]),
        labels:{
          style:{
            colors:getColorsForLevel(this.reporte_modalidades,this.metas_nivel),
            fontSize: "12px",
            fontWeight: "bold"
          },
          hideOverlappingLabels:false,
          rotate:-25,
          rotateAlways:true
        }
      }
    };
  }
}
