import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
    CentroFormacionActionsComponent
  ],
  templateUrl: './centro-formacion-page.component.html',
  styleUrl: './centro-formacion-page.component.css',
  viewProviders: [provideIcons({ 
    lucideSchool
  })]
})
export class CentroFormacionPageComponent implements OnInit{

  @Input() slug_regional?:string;

  private centro_formacion_service = inject(CentroFormacionService);

  centros_formacion:CentroFormacionModel[] = [];

  loading:boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(){
    if (this.slug_regional) {
      const dataSub = this.centro_formacion_service.getAllByRegional(this.slug_regional)
      .subscribe({
        next:(centros_formacion)=>{
          this.centros_formacion = [...centros_formacion];
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
      return;
    }
    const dataSub = this.centro_formacion_service.getAll()
      .subscribe({
        next:(centros_formacion)=>{
          this.centros_formacion = [...centros_formacion];
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

  onCreate(regional:CentroFormacionModel){
    this.centros_formacion = [...this.centros_formacion,regional];
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
}
