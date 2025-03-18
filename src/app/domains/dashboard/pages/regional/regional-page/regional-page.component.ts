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
import { heroMapSolid } from '@ng-icons/heroicons/solid';
import { RegionalModel } from '@shared/models/regional.model';
import { RegionalService } from '@shared/services/regional.service';
import { RegionalActionsComponent } from '../components/regional-actions/regional-actions.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-regional-page',
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
    RegionalActionsComponent,
    RouterModule,
    NzPaginationModule
  ],
  templateUrl: './regional-page.component.html',
  styleUrl: './regional-page.component.css',
  viewProviders: [provideIcons({ 
    heroMapSolid
  })]
})
export class RegionalPageComponent implements OnInit,OnDestroy {

  private regional_service = inject(RegionalService);

  private data_sub?:Subscription;

  regionales:RegionalModel[] = [];

  numero_regionales:number = 0;

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
    return this.regional_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getData()
      .subscribe({
        next:(p_regionales)=>{
          let {results,count} = p_regionales;
          this.regionales = [...results];
          this.numero_regionales = count;
          this.onLoad(false);
        },
      })
  }

  changePage(page:number){
    this.page = page;
    this.loadData();
  }

  onCreate(regional:RegionalModel){
    this.regionales = [...this.regionales,regional];
  }

  onUpdate(data:{index:number,regional:RegionalModel}){    
    let regionales = [...this.regionales];
    regionales[data.index] = data.regional;
    this.regionales = [...regionales];
  }

  onDelete(index:number){
    let regionales = [...this.regionales];
    regionales.splice(index,1);
    this.regionales = regionales;
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

}
