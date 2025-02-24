import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { MetasFormacionService } from '@shared/services/metas-formacion.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { MetasFormacionActionsComponent } from "../components/metas-formacion-actions/metas-formacion-actions.component";

@Component({
  selector: 'app-metas-formacion-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    SenaLoadingComponent,
    CanUseActionsDirective,
    NzPaginationModule,
    MetasFormacionActionsComponent
],
  templateUrl: './metas-formacion-page.component.html',
  styleUrl: './metas-formacion-page.component.css'
})
export class MetasFormacionPageComponent implements OnInit,OnDestroy{

  private meta_formacion_service = inject(MetasFormacionService);
  private data_sub?: Subscription;

  metas_formacion:MetaFormacionModel[] = [];

  numero_metas:number = 0;

  page:number = 1;
  page_size:number = 10;

  filters:{[key:string]:number|string} = {};

  loading:boolean = true;

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void {
    this.resetDataSub();
  }

  private getData(){
    return this.meta_formacion_service.getAll({page_number:this.page,page_size:this.page_size,filter:this.filters});
  }

  private loadData(){
    this.loading = true;
    this.resetDataSub();
    this.data_sub = this.getData().subscribe({
      next:(p_metas)=>{
        console.log(p_metas);
        
        let {results,count} = p_metas;
        this.metas_formacion = results;
        this.numero_metas = count;
        this.onLoad(false);
      } 
    });
  }

  changePage(p_page:number){
    this.page = p_page;
    this.loadData();
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  resetDataSub(){
    if(this.data_sub){
      this.data_sub.unsubscribe();
    }
  }

  onCreate(meta:MetaFormacionModel) {
    this.metas_formacion = [...this.metas_formacion,meta];
  }

  onUpdate(data:{metaFormacion:MetaFormacionModel, index:number}) {    
    let {metaFormacion,index} = data;
    let metas = [...this.metas_formacion];
    metas[index] = metaFormacion;
    this.metas_formacion = [...metas];
  }

  onDelete(index:number) {
    let metas = [...this.metas_formacion];
    metas.splice(index,1);
    this.metas_formacion = [...metas];
  }
}
