import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PieChartAprentidicesComponent } from '../components/pie-chart-aprentidices/pie-chart-aprentidices.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChartPie } from '@ng-icons/heroicons/outline';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-reporte-aprendices-page',
  standalone: true,
  imports: [
    CommonModule,
    PieChartAprentidicesComponent,
    NzCardModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule
  ],
  templateUrl: './reporte-aprendices-page.component.html',
  styleUrl: './reporte-aprendices-page.component.css',
  viewProviders: [provideIcons({ 
    heroChartPie
  })]
})
export class ReporteAprendicesPageComponent {

}
