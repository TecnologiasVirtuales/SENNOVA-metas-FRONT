import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PieChartFichasComponent } from '../components/pie-chart-fichas/pie-chart-fichas.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { heroChartPie } from '@ng-icons/heroicons/outline';
import { Df14Service } from '@shared/services/documents/df14.service';
import { Subscription } from 'rxjs';
import { DF14FichaModel } from '@shared/models/df14.model';

@Component({
  selector: 'app-reporte-fichas-page',
  standalone: true,
  imports: [
    CommonModule,
    PieChartFichasComponent,
    NzCardModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    NzPaginationModule,
    NzSelectModule,
    FormsModule,
  ],
  templateUrl: './reporte-fichas-page.component.html',
  styleUrl: './reporte-fichas-page.component.css',
  viewProviders: [provideIcons({ 
    heroChartPie
  })]
})
export class ReporteFichasPageComponent implements OnInit,OnDestroy{

  df14_service:Df14Service = inject(Df14Service);

  data_subscription?:Subscription;

  fichas:DF14FichaModel[] = [];

  numero_fichas:number = 0;

  page_table:number = 1;
  page_size:number = 10;

  filters:{[key:string]:number|string} = {};

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.resetDataSub();
  }

  getFichas(){
    return this.df14_service.getFichas({filter:this.filters,page_number:this.page_table,page_size:this.page_size});
  }

  getData(){
    this.resetDataSub();
    this.data_subscription = this.getFichas()
      .subscribe({
        next:(p_fichas)=>{
          let {results,count} = p_fichas
          this.fichas = [...results];
          this.numero_fichas = count;
        }
      });
  }

  onFilter(filters:{[key:string]:string|number}){
    this.filters = filters;
    this.getData();
  }

  changePage(page:number){
    this.page_table = page;
    this.getData();
  }

  sizeChange(){
    this.page_table = 1;
    this.getData();
  }

  resetDataSub(){
    if(this.data_subscription) this.data_subscription.unsubscribe();
  }

}
