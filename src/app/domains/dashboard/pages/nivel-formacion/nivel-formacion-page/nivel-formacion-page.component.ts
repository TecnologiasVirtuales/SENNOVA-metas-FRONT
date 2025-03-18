import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ModalidadActionsComponent } from '../../modalidad/components/modalidad-actions/modalidad-actions.component';
import { NivelFormacionService } from '@shared/services/nivel-formacion.service';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';
import {simpleLevelsdotfyi} from '@ng-icons/simple-icons'
import { NivelFormacionActionsComponent } from '../components/nivel-formacion-actions/nivel-formacion-actions.component';
import { filter, Subscription } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-nivel-formacion-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    NivelFormacionActionsComponent,
    NgIconComponent,
    NzTableModule,
    NzSkeletonModule,
    SenaLoadingComponent,
    CanUseActionsDirective,
    NzPaginationModule
  ],
  templateUrl: './nivel-formacion-page.component.html',
  styleUrl: './nivel-formacion-page.component.css',
  viewProviders: [provideIcons({ 
    simpleLevelsdotfyi
  })]
})
export class NivelFormacionPageComponent implements OnInit,OnDestroy{

  
  private nivel_formacion_service = inject(NivelFormacionService);

  private data_sub?:Subscription
  

  niveles_formacion:NivelFormacionModel[] = [];

  numero_niveles:number = 0;

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
    return this.nivel_formacion_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getData()
      .subscribe({
        next:(p_niveles)=>{
          let {results,count} = p_niveles;
          this.niveles_formacion = [...results];
          this.numero_niveles = count;
          this.onLoad(false);
        }
      })
  }

  changePage(page:number){
    this.page = page;
    this.loadData();
  }

  onCreate(nivel_formacion:NivelFormacionModel){
    this.niveles_formacion = [...this.niveles_formacion,nivel_formacion];
  }

  onUpdate(data:{index:number,nivel_formacion:NivelFormacionModel}){    
    let niveles_formacion = [...this.niveles_formacion];
    niveles_formacion[data.index] = data.nivel_formacion;
    this.niveles_formacion = [...niveles_formacion];
  }

  onDelete(index:number){
    let niveles_formacion = [...this.niveles_formacion];
    niveles_formacion.splice(index,1);
    this.niveles_formacion = niveles_formacion;
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }
}
