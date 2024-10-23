import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
    RouterModule
  ],
  templateUrl: './regional-page.component.html',
  styleUrl: './regional-page.component.css',
  viewProviders: [provideIcons({ 
    heroMapSolid
  })]
})
export class RegionalPageComponent implements OnInit {

  private regional_service = inject(RegionalService);

  regionales:RegionalModel[] = [];

  loading:boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(){
    const dataSub = this.regional_service.getAll()
      .subscribe({
        next:(regionales)=>{
          this.regionales = [...regionales];
        },
        error:()=>{
          this.loading = false;
          dataSub.unsubscribe();
        },
        complete:()=>{
          this.loading = false;
          dataSub.unsubscribe();
        }
      })
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

}
