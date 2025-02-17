import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { NivelFormacionFormComponent } from '../nivel-formacion-form/nivel-formacion-form.component';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';
import { NivelFormacionService } from '@shared/services/nivel-formacion.service';
import { ModalidadFormComponent } from '@domains/dashboard/pages/modalidad/components/modalidad-form/modalidad-form.component';
import { ModalidadDto } from '@shared/dto/modalidad/modalidad.dto';
import { NivelFormacionDto } from '@shared/dto/nivel-formacion/nivel-formacion.dto';

@Component({
  selector: 'app-nivel-formacion-actions',
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
  templateUrl: './nivel-formacion-actions.component.html',
  styleUrl: './nivel-formacion-actions.component.css'
})
export class NivelFormacionActionsComponent implements OnInit,OnDestroy{
  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;


  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private nivel_formacion_service = inject(NivelFormacionService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() nivel_formacion?:NivelFormacionModel;
  @Input() index?:number;

  @Output() create:EventEmitter<NivelFormacionModel> = new EventEmitter();
  @Output() update:EventEmitter<{nivel_formacion:NivelFormacionModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  title: 'Crear nivel de formación'|'Editar nivel de formación' = 'Crear nivel de formación';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;


  validSub:Subscription|null = null;
  disabled:boolean = true;

  instance?:NivelFormacionFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.nivel_formacion) {      
      this.title = 'Editar nivel de formación';
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
      nzContent:NivelFormacionFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{nivel_formacion:this.nivel_formacion},
      nzFooter:this.footerSaveTemplate,
      nzWidth:'500px',
      nzDraggable:true,
      nzMaskClosable:false,
      nzClosable:false
    });

    console.log(this.nivel_formacion);
    

    this.instance = this.modal.getContentComponent();    

    const modalSub = this.modal.afterClose
      .subscribe({
        next:(response)=>{
          if(!response)return;
          const {form} = response;
          if(!form) return;
          this.instance!.nivel_formacion
            ? this.editarNivelFormacion(form,this.nivel_formacion!.id)
            : this.crearNivelFormacion(form)
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

  eliminarNivelFormacion(){
    this.loadingStatus(true);
    const {id} = this.nivel_formacion!;
    const deleteSub = this.nivel_formacion_service.delete(id)
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

  editarNivelFormacion(form:NivelFormacionDto,id:number){
    this.loadingStatus(true);
    const editSub = this.nivel_formacion_service.update(form,id)
      .subscribe({
        next:(modalidad)=>{
          this.update.emit({index:this.index!,nivel_formacion:modalidad});
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

  crearNivelFormacion(form: NivelFormacionDto) {
    this.loadingStatus(true);
    const createSub = this.nivel_formacion_service.create(form)
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
