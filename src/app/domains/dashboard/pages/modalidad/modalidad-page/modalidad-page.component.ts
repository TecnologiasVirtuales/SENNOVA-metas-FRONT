import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ModalidadActionsComponent } from "../components/modalidad-actions/modalidad-actions.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroAcademicCapSolid } from '@ng-icons/heroicons/solid';
import {NzTableModule} from 'ng-zorro-antd/table';
import { ModalidadService } from '@shared/services/modalidad.service';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modalidad-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    ModalidadActionsComponent,
    NgIconComponent,
    NzTableModule,
    SenaLoadingComponent,
    CanUseActionsDirective,
    NzPaginationModule
],
  templateUrl: './modalidad-page.component.html',
  styleUrl: './modalidad-page.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid
  })]
})
export class ModalidadPageComponent implements OnInit,OnDestroy{

  private modalidad_service = inject(ModalidadService);

  private data_sub?:Subscription

  modalidades:ModalidadModel[] = [];

  numero_modalidades:number = 0;

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
    return this.modalidad_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getData()
      .subscribe({
        next:(p_modalidades)=>{
          let {results,count} = p_modalidades;
          this.modalidades = [...results];
          this.numero_modalidades = count;
          this.onLoad(false);
        }
      })
  }

  changePage(page:number){
    this.page = page;
    this.loadData();
  }

  onCreate(modalidad:ModalidadModel){
    this.modalidades = [...this.modalidades,modalidad];
  }

  onUpdate(data:{index:number,modalidad:ModalidadModel}){    
    let modalidades = [...this.modalidades];
    modalidades[data.index] = data.modalidad;
    this.modalidades = [...modalidades];
  }

  onDelete(index:number){
    let modalidades = [...this.modalidades];
    modalidades.splice(index,1);
    this.modalidades = modalidades;
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }
}
