import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {lucideSchool} from '@ng-icons/lucide';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CentroFormacionActionsComponent } from '../components/centro-formacion-actions/centro-formacion-actions.component';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { Subscription } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-centro-formacion-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    NzSkeletonModule,
    SenaLoadingComponent,
    CanUseActionsDirective,
    CentroFormacionActionsComponent,
    NzPaginationModule
  ],
  templateUrl: './centro-formacion-page.component.html',
  styleUrl: './centro-formacion-page.component.css',
  viewProviders: [provideIcons({ 
    lucideSchool
  })]
})
export class CentroFormacionPageComponent implements OnInit,OnDestroy{

  private centro_formacion_service = inject(CentroFormacionService);

  private data_sub?:Subscription

  numero_centros:number = 0;

  centros_formacion:CentroFormacionModel[] = [];

  page:number = 1;
  page_size:number = 10;

  filters:{[key:string]:number|string} = {};

  loading:boolean = true;

  allowed_actions:string[] = ['admin'];


  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.resetDataSub();
  }

  private getData(){
    return this.centro_formacion_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getData()
      .subscribe({
        next:(p_centros)=>{
          let {results,count} = p_centros;
          this.centros_formacion = [...results];
          this.numero_centros = count;
          this.onLoad(false);
        }
      });
  }

  changePage(page:number){
    this.page = page;
    this.loadData();
  }

  onCreate(centro:CentroFormacionModel){
    this.centros_formacion = [...this.centros_formacion,centro];
  }

  onUpdate(data:{index:number,centro_formacion:CentroFormacionModel}){    
    let centros_formacion = [...this.centros_formacion];
    centros_formacion[data.index] = data.centro_formacion;
    this.centros_formacion = [...centros_formacion];
  }

  onDelete(index:number){
    let centros_formacion = [...this.centros_formacion];
    centros_formacion.splice(index,1);
    this.centros_formacion = centros_formacion;
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }
}
