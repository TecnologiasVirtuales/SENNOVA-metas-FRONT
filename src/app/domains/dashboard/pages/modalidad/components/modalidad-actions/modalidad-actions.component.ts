import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalidadFormComponent } from '../modalidad-form/modalidad-form.component';
import { ModalidadModel } from '@shared/models/modalidad.model';
import {NzModalModule, NzModalRef, NzModalService} from 'ng-zorro-antd/modal'
import { ModalidadDto } from '@shared/dto/modalidad/modalidad.dto';
import { ModalidadService } from '@shared/services/modalidad.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import {NzIconModule} from 'ng-zorro-antd/icon'
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { Subscription } from 'rxjs';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-modalidad-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzFlexModule,
    NzIconModule,
    ModalFooterComponent,
    NzAlertModule
  ],
  templateUrl: './modalidad-actions.component.html',
  styleUrl: './modalidad-actions.component.css'
})
export class ModalidadActionsComponent implements OnInit,OnDestroy {

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;


  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private modalidad_service = inject(ModalidadService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() modalidad?:ModalidadModel;
  @Input() index?:number;

  @Output() create:EventEmitter<ModalidadModel> = new EventEmitter();
  @Output() update:EventEmitter<{modalidad:ModalidadModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  title: 'Crear modalidad'|'Editar modalidad' = 'Crear modalidad';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;


  validSub:Subscription|null = null;
  disabled:boolean = true;

  instance?:ModalidadFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.modalidad) {      
      this.title = 'Editar modalidad';
      this.icon = 'edit';
    }
  }

  ngOnDestroy(): void {
    if(this.validSub){
      this.validSub.unsubscribe();
    }
  }

  openForm() {
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:ModalidadFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{modalidad:this.modalidad},
      nzFooter:this.footerSaveTemplate,
      nzWidth:'500px',
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
          this.save_loading = false;
          modalSub.unsubscribe()
        },
        complete:()=>modalSub.unsubscribe()
      });

    this.validSub = this.instance!.form.valueChanges
      .subscribe({
        next:()=>{
          const {form} = this.instance!;
          this.disabled = form.invalid;    
        }
      })
  }

  onDelete(){
    this.modal = this.modal_service.create({
      nzContent:this.contentAlertTemplate,
      nzFooter: this.footerAlertTemplate,
      nzWidth: '400px',
      nzMaskClosable: false,
      nzClosable: false,
      nzDraggable:true
    });
  }
  

  handleGuardar(){
    this.instance?.submitForm();
    this.save_loading = true;
  }

  handleCancelar(){
    this.modal?.destroy({form:null});
  }

  eliminarModalidad(){
    this.loadingStatus(true);
    const {id} = this.modalidad!;
    const deleteSub = this.modalidad_service.delete(id)
      .subscribe({
        next:()=>{
          this.delete.emit(this.index!);
          this.modal?.close();
        },
        error:()=>{
          this.loadingStatus(false);
          this.modal?.close();
          deleteSub.unsubscribe()
        },
        complete:()=>{
          this.loadingStatus(false);
          this.modal?.close();
          deleteSub.unsubscribe()
        }
      });
  }

  editarModalidad(form:ModalidadDto,id:number){
    this.loadingStatus(true);
    const editSub = this.modalidad_service.update(form,id)
      .subscribe({
        next:(modalidad)=>{
          this.update.emit({index:this.index!,modalidad:modalidad});
        },
        error:()=>{
          this.loadingStatus(false);
          editSub.unsubscribe();
        },
        complete:()=>{
          this.loadingStatus(false);
          editSub.unsubscribe()
        }
      });
  }

  crearModalidad(form: ModalidadDto) {
    this.loadingStatus(true);
    const createSub = this.modalidad_service.create(form)
      .subscribe({
        next:(modalidad)=>{
          this.create.emit(modalidad);
        },
        error:()=>{
          this.loadingStatus(false);
          createSub.unsubscribe();
        },
        complete:()=>{
          this.loadingStatus(false);
          createSub.unsubscribe();
        }
      })    
  }

  loadingStatus(status:boolean){
    this.save_loading = status;
    this.setLoading.emit(status);
  }

}
