import { CommonModule } from '@angular/common';
import { Component,Input, OnChanges, OnInit } from '@angular/core';
import { getColorsForLevel } from '@shared/functions/colors.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { ChartOptions } from '@shared/types/chart-options.type';
import { ChartComponent } from 'ng-apexcharts';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-bar-char-nivel-modalidad',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NzCardComponent,
  ],
  templateUrl: './bar-char-nivel-modalidad.component.html',
  styleUrl: './bar-char-nivel-modalidad.component.css',
})
export class BarCharNivelModalidadComponent implements OnChanges{
  @Input({required:true}) reporte_nivel:ReporteChartModel = {} as ReporteChartModel;
  @Input({required:true}) meta_nivel:ReporteChartModel = {} as ReporteChartModel;
  @Input({required:true}) nivel:string = '';


  chart_options?:Partial<ChartOptions>;

  ngOnChanges(): void {
    this.setChartData();
  }

  get modalidades(){
    return Object.keys(this.reporte_nivel);
  }

  get reporte_series(){
    return Object.keys(this.reporte_nivel).map((k)=>this.reporte_nivel[k] as number);
  }

  get meta_series(){
    return Object.keys(this.meta_nivel).map((k)=>this.meta_nivel[k] as number);
  }

  setChartData(){    
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
      colors: getColorsForLevel(this.reporte_nivel,this.meta_nivel,false),
      plotOptions: {
        bar: {
          columnWidth: '80%',
          distributed: true
        },
      },
      dataLabels: {
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
            colors:getColorsForLevel(this.reporte_nivel,this.meta_nivel),
            fontSize: "12px",
            fontWeight: "bold"
          },
        }
      }
    };
  }
}
