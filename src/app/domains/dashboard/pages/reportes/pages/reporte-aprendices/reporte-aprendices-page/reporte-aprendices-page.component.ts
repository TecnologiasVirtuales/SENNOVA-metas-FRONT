import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PieChartAprentidicesComponent } from '../components/pie-chart-aprentidices/pie-chart-aprentidices.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChartPie } from '@ng-icons/heroicons/outline';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Df14Service } from '@shared/services/documents/df14.service';
import { DF14AprendizModel } from '@shared/models/df14.model';
import { Subscription } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { SearchCellComponent } from '@shared/components/search-cell/search-cell.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { lucideSearch } from '@ng-icons/lucide';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';

@Component({
  selector: 'app-reporte-aprendices-page',
  standalone: true,
  imports: [
    CommonModule,
    PieChartAprentidicesComponent,
    NzCardModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    NzPaginationModule,
    NzSelectModule,
    FormsModule,
    NzDropDownModule,
    NzInputModule,
    OnlyNumbersDirective
  ],
  templateUrl: './reporte-aprendices-page.component.html',
  styleUrl: './reporte-aprendices-page.component.css',
  viewProviders: [provideIcons({ 
    heroChartPie,
    lucideSearch
  })]
})
export class ReporteAprendicesPageComponent implements OnInit,OnDestroy {

  df14_service:Df14Service = inject(Df14Service);

  data_subscription?:Subscription;

  aprendices:DF14AprendizModel[] = [];

  numero_aprendices:number = 0;
  page_table:number = 1;
  page_size:number = 10;

  filters:{[key:string]:number|string} = {};

  buscar_aprendiz:boolean = false;
  buscar_aprendiz_value?:number;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.resetDataSub();
  }

  getAprendices(){
    return this.df14_service.getAprendices({filter:this.filter_aprendiz,page_number:this.page_table,page_size:this.page_size});
  }

  get filter_aprendiz(){
    let filters = this.filters;
    if(this.buscar_aprendiz_value) filters['numero_documento'] = this.buscar_aprendiz_value;
    return filters;
  }

  getData(){
    this.resetDataSub();
    this.data_subscription = this.getAprendices()
    .subscribe({
      next:(p_aprendices)=>{
        let {results,count} = p_aprendices;
        this.aprendices = [...results];
        this.numero_aprendices = count;
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

  onSearch(){
    console.log(this.buscar_aprendiz_value);
    
    this.getData();
  }
  onResetSearch(){
    this.buscar_aprendiz_value = undefined;
    this.getData();
  }

  resetDataSub(){
    if(this.data_subscription) this.data_subscription.unsubscribe();
  }

}
