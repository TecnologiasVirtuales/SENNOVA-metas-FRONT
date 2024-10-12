import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalidadFormComponent } from '../modalidad-form/modalidad-form.component';
import { ModalidadModel } from '@shared/models/modalidad.model';
import {NzModalModule, NzModalRef, NzModalService} from 'ng-zorro-antd/modal'
import { ModalidadDto } from '@shared/dto/modalidad/modalidad.dto';
import { ModalidadService } from '@shared/services/modalidad.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import {NzIconModule} from 'ng-zorro-antd/icon'

@Component({
  selector: 'app-modalidad-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzFlexModule,
    NzIconModule
  ],
  templateUrl: './modalidad-actions.component.html',
  styleUrl: './modalidad-actions.component.css'
})
export class ModalidadActionsComponent implements OnInit {

  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private modalidad_service = inject(ModalidadService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() modalidad?:ModalidadModel;

  title: 'Crear modalidad'|'Editar modalidad' = 'Editar modalidad';
  icon: 'plus'|'edit' = 'plus';
  saveLoading:boolean = false;

  instance?:ModalidadFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.modalidad) {      
      this.title = 'Editar modalidad';
      this.icon = 'edit';
    }
  }

  openForm() {
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:ModalidadFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{modalidad:this.modalidad},
      nzFooter:[
        {
          id:'cancelar',
          label:'Cancelar',
          type:'default',
          onClick:()=> this.modal?.destroy({form:null})
        },
        {
          id:'guardar',
          label:'Guardar',
          loading:this.saveLoading,
          onClick:()=>this.handleGuardar()
        }
      ],
      nzWidth:'50%',
      nzDraggable:true,
      nzMaskClosable:false,
      nzClosable:false
    });

    this.instance = this.modal.getContentComponent();    

    const modalSub = this.modal.afterClose
      .subscribe({
        next:(response)=>{
          if(!response)return;
          const {form} = response;
          if(!form) return;
          this.instance!.modalidad
            ? this.editarModalidad(form,this.modalidad!.id)
            : this.crearModalidad(form)
        },
        error:()=>{
          this.saveLoading = false;
          modalSub.unsubscribe()
        },
        complete:()=>modalSub.unsubscribe()
      });
  }

  private handleGuardar = () => {
    this.instance?.submitForm();
    this.saveLoading = true;
  }

  editarModalidad(form:ModalidadDto,id:number){
    const editSub = this.modalidad_service.update(form,id)
      .subscribe({
        next:(modalidad)=>{
          console.log(modalidad);
        },
        error:()=>{
          this.saveLoading = false;
          editSub.unsubscribe();
        },
        complete:()=>{
          this.saveLoading = false;
          editSub.unsubscribe()
        }
      });
  }

  crearModalidad(form:ModalidadDto){
    const editSub = this.modalidad_service.create(form)
      .subscribe({
        next:(modalidad)=>{
          console.log(modalidad);
        },
        error:()=>{
          this.saveLoading = false;
          editSub.unsubscribe();
        },
        complete:()=>{
          this.saveLoading = false;
          editSub.unsubscribe()
        }
      });
  }
}
