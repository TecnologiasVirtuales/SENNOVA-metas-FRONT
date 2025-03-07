import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { getColorsForLevel } from '@shared/functions/colors.functions';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { ChartOptions } from '@shared/types/chart-options.type';
import { ChartComponent } from 'ng-apexcharts';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-bar-char-general',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NzCardComponent
  ],
  templateUrl: './bar-char-general.component.html',
  styleUrl: './bar-char-general.component.css'
})
export class BarCharGeneralComponent implements OnChanges{
  @Input({required:true}) reporte:ReporteChartModel = {} as ReporteChartModel;
  @Input({required:true}) meta:ReporteChartModel = {} as ReporteChartModel;
  @Input({required:true}) title:string = '';

  chart_options?:Partial<ChartOptions>;


  ngOnChanges(): void {
    this.setChartData();
  }

  get labels(){
    return Object.keys(this.reporte);
  }

  get reporte_series(){
    return Object.keys(this.reporte).map((k)=>this.reporte[k] as number);
  }

  get meta_series(){
    return Object.keys(this.meta).map((k)=>this.meta[k] as number);
  }

  setChartData(){
    const repSeries = this.reporte_series;
    const metaSeries = this.meta_series;
    const categories = this.labels;
    console.log('rep',repSeries);
    console.log('categories',categories);
    console.log('meta',metaSeries);
    
    if(!repSeries.length || !metaSeries.length || categories.length === 0) {
      console.warn("Faltan datos para renderizar el gráfico");
      return;
    }    
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
        width:1250,
        type: 'bar',
      },
      colors: getColorsForLevel(this.reporte,this.meta,false),
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
        categories: this.labels.map(l=>[l]),
        labels:{
          style:{
            colors:getColorsForLevel(this.reporte,this.meta),
            fontSize: "10px",
            fontWeight: "bold"
          },
          hideOverlappingLabels:false,
          rotate:-25
        }
      }
    };
    
  }
}
