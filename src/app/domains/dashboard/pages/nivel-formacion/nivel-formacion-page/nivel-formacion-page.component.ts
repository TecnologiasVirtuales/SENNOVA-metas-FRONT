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
import { ModalidadActionsComponent } from '../../modalidad/components/modalidad-actions/modalidad-actions.component';
import { NivelFormacionService } from '@shared/services/nivel-formacion.service';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';
import {simpleLevelsdotfyi} from '@ng-icons/simple-icons'
import { NivelFormacionActionsComponent } from '../components/nivel-formacion-actions/nivel-formacion-actions.component';

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
    CanUseActionsDirective
  ],
  templateUrl: './nivel-formacion-page.component.html',
  styleUrl: './nivel-formacion-page.component.css',
  viewProviders: [provideIcons({ 
    simpleLevelsdotfyi
  })]
})
export class NivelFormacionPageComponent implements OnInit{

  
  private nivel_formacion_service = inject(NivelFormacionService);

  niveles_formacion:NivelFormacionModel[] = [];

  loading:boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(){
    const dataSub = this.nivel_formacion_service.getAll()
      .subscribe({
        next:(niveles_formacion)=>{
          this.niveles_formacion = [...niveles_formacion];
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
}
