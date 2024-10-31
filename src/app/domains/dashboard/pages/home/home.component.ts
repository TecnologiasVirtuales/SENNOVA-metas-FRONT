import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FichasByModalidadModel } from '@shared/models/fichas-by-nivel-modalidad.model';
import { ReportesService } from '@shared/services/reportes.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill
} from "ng-apexcharts";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzFlexModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{
  private reporte_service = inject(ReportesService);

  private data_sub:Subscription|null = null;

  fichas_by_nivel_modalidad:FichasByModalidadModel = {}

  modalidades_matriz:string[] = [];
  niveles_matriz:string[] = [];

  ngOnInit(): void {
    this.data_sub = this.reporte_service.fichasByNivelModalidad()
      .subscribe({
        next:(data)=>{
          this.fichas_by_nivel_modalidad = {...data};
          this.niveles_matriz = Object.keys(this.fichas_by_nivel_modalidad);
          this.modalidades_matriz = Object.keys(this.fichas_by_nivel_modalidad[this.niveles_matriz[0]]);
        }
      })
  }

  ngOnDestroy(): void {
    this.data_sub!.unsubscribe();
  }
}
