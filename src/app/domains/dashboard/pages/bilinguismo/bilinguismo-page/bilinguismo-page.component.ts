import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLanguage } from '@ng-icons/heroicons/outline';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { BilinguismoModel } from '@shared/models/bilinguismo.model';
import { BilinguismoService } from '@shared/services/bilinguismo.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { BilinguismoActionsComponent } from '../components/bilinguismo-actions/bilinguismo-actions.component';
import { AuthLayoutComponent } from "../../../../auth/auth-layout/auth-layout.component";

@Component({
  selector: 'app-bilinguismo-page',
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
    BilinguismoActionsComponent,
],
  templateUrl: './bilinguismo-page.component.html',
  styleUrl: './bilinguismo-page.component.css',
  viewProviders: [provideIcons({ 
    heroLanguage
  })]
})
export class BilinguismoPageComponent implements OnInit, OnDestroy {
  private bilinguismo_service = inject(BilinguismoService);

  private data_sub?: Subscription;

  lista_bilinguismo:BilinguismoModel[] = [];

  numero_bilinguismo:number = 0;

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
    return this.bilinguismo_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getData().subscribe({
      next:(p_bil) => {
      let {results,count} = p_bil;
      this.lista_bilinguismo = [...results];
      this.numero_bilinguismo = count;
      this.onLoad(false);
    }});
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  changePage(p_page:number){
    this.page = p_page;
    this.loadData();
  }

  onCreate(bil:BilinguismoModel){
    this.lista_bilinguismo = [...this.lista_bilinguismo,bil];
  }

  onUpdate(data:{bilinguismo:BilinguismoModel,index:number}){
    let {bilinguismo: bil,index} = data;
    let lista_bilinguismo = [...this.lista_bilinguismo];
    lista_bilinguismo[index] = bil;
    this.lista_bilinguismo = [...lista_bilinguismo];
  }

  onDelete(index:number){
    let lista_bilinguismo = [...this.lista_bilinguismo];
    lista_bilinguismo.splice(index,1);
    this.lista_bilinguismo = lista_bilinguismo;
  }


  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }
}
