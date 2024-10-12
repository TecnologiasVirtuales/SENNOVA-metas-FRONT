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
    NzSkeletonModule
],
  templateUrl: './modalidad-page.component.html',
  styleUrl: './modalidad-page.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid
  })]
})
export class ModalidadPageComponent implements OnInit{

  private modalidad_service = inject(ModalidadService);

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
}
