import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ModalidadActionsComponent } from "../components/modalidad-actions/modalidad-actions.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroAcademicCapSolid } from '@ng-icons/heroicons/solid';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import { ModalidadService } from '@shared/services/modalidad.service';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { AuthService } from '@shared/services/auth.service';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';

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
    NzSkeletonModule,
    SenaLoadingComponent,
    CanUseActionsDirective
],
  templateUrl: './modalidad-page.component.html',
  styleUrl: './modalidad-page.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid
  })]
})
export class ModalidadPageComponent implements OnInit{

  private modalidad_service = inject(ModalidadService);
  private auth_service = inject(AuthService);

  usuario = this.auth_service.usuario;

  modalidades:ModalidadModel[] = [];

  loading:boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(){
    const dataSub = this.modalidad_service.getAll()
      .subscribe({
        next:(modalidades)=>{
          this.modalidades = [...modalidades];
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
}
