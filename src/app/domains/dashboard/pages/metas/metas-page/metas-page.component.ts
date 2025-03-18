import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGoal } from '@ng-icons/lucide';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MetasActionsComponent } from '../components/metas-actions/metas-actions.component';
import { MetasService } from '@shared/services/metas.service';
import { MetaModel } from '@shared/models/meta.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metas-page',
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
    MetasActionsComponent
  ],
  templateUrl: './metas-page.component.html',
  styleUrl: './metas-page.component.css',
  viewProviders: [provideIcons({ 
    lucideGoal
  })]
})
export class MetasPageComponent implements OnInit, OnDestroy {
  private meta_service = inject(MetasService);

  private data_sub?: Subscription;

  metas:MetaModel[] = [];

  numero_metas:number = 0;

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
    return this.meta_service.getAll({page_number: this.page, page_size: this.page_size, filter:this.filters});
  }

  private loadData() {
    this.loading = true;
    this.resetDataSub();
    this.data_sub = this.getData()
    .subscribe({
      next:(p_metas)=>{
        let {results,count} = p_metas;
        this.metas = [...results];
        this.numero_metas = count;
        this.onLoad(false);
      }
    });
  }

  resetDataSub() {
    if (this.data_sub) {
      this.data_sub.unsubscribe();
    }
  }
  
  changePage(p_page:number){
    this.page = p_page;
    this.loadData();
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  onCreate(meta:MetaModel) {
    this.metas = [...this.metas,meta];
  }

  onUpdate(data:{meta:MetaModel, index:number}) {    
    let {meta,index} = data;
    let metas = [...this.metas];
    metas[index] = meta;
    this.metas = [...metas];
  }

  onDelete(index:number) {
    let metas = [...this.metas];
    metas.splice(index,1);
    this.metas = [...metas];
  }

}
