import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { CentroFormacionFormComponent } from '../centro-formacion-form/centro-formacion-form.component';
import { CentroFormacionDto } from '@shared/dto/centro-formacion/centro-formacion.dto';

@Component({
  selector: 'app-centro-formacion-actions',
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
  templateUrl: './centro-formacion-actions.component.html',
  styleUrl: './centro-formacion-actions.component.css'
})
export class CentroFormacionActionsComponent {
  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;


  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private centro_formacion_service = inject(CentroFormacionService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() centro_formacion?:CentroFormacionModel;
  @Input() index?:number;

  @Output() create:EventEmitter<CentroFormacionModel> = new EventEmitter();
  @Output() update:EventEmitter<{centro_formacion:CentroFormacionModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  title: 'Crear centro de formación'|'Editar centro de formación' = 'Crear centro de formación';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;


  validSub:Subscription|null = null;
  disabled:boolean = true;

  instance?:CentroFormacionFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.centro_formacion) {      
      this.title = 'Editar centro de formación';
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
      nzContent:CentroFormacionFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{centro_formacion:this.centro_formacion},
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
          this.instance!.centro_formacion
            ? this.editarCentroFormacion(form,this.centro_formacion!.codigo)
            : this.crearCentroFormacion(form)
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

  eliminarCentroFormacion(){
    this.loadingStatus(true);
    const {codigo} = this.centro_formacion!;
    const deleteSub = this.centro_formacion_service.delete(codigo)
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

  editarCentroFormacion(form:CentroFormacionDto,id:number){    
    this.loadingStatus(true);
    const editSub = this.centro_formacion_service.update(form,id)
      .subscribe({
        next:(centro_formacion)=>{
          this.update.emit({index:this.index!,centro_formacion:centro_formacion});
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

  crearCentroFormacion(form: CentroFormacionDto) {
    this.loadingStatus(true);
    const createSub = this.centro_formacion_service.create(form)
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
