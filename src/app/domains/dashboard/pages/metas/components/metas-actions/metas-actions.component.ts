import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { BilinguismoModel } from '@shared/models/bilinguismo.model';
import { MetaModel } from '@shared/models/metas.model';
import { MetasService } from '@shared/services/metas.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { MetasFormComponent } from '../metas-form/metas-form.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-metas-actions',
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
  templateUrl: './metas-actions.component.html',
  styleUrl: './metas-actions.component.css'
})
export class MetasActionsComponent implements OnInit,OnDestroy{

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;

  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private metas_service = inject(MetasService);
  
  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() meta?:MetaModel;
  @Input() index?:number;

  @Output() create:EventEmitter<MetaModel> = new EventEmitter();
  @Output() update:EventEmitter<{meta:MetaModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();
  
  title: 'Crear meta'|'Editar meta' = 'Crear meta';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;
  disabled:boolean = true;

  instance?:MetasFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if(this.meta){
      this.title = 'Editar meta';
      this.icon = 'edit';
    }
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.closeValidSub();
    this.closeModalSub();
  }

  closeValidSub(){
    if(this.valid_sub)this.valid_sub.unsubscribe();
  }

  closeModalSub(){
    if(this.modal_sub)this.modal_sub.unsubscribe();
  }

  resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

  loadingStatus(status:boolean){
    this.save_loading = status;
    this.setLoading.emit(status);
  }

  crearMeta(form:MetaModel){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metas_service.create(form)
      .subscribe({
        next:(response)=>{
          this.create.emit(response);
          this.loadingStatus(false);
        }
      });
  }

  editarMeta(form:MetaModel,id:number){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metas_service.update(form,id)
      .subscribe({
        next:(response)=>{
          this.update.emit({meta:response,index:this.index!});
          this.loadingStatus(false);
        }
      });
  }

  eliminarMeta(){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metas_service.delete(this.meta!.met_id)
      .subscribe({
        next:()=>{
          this.delete.emit(this.index!);
          this.modal?.close();
          this.loadingStatus(false);
        }
      });
  }

  startModalSub(){
    if(!this.instance)return;
    this.modal_sub = this.modal!.afterClose
    .subscribe({
      next:(response)=>{
        if(!response)return this.loadingStatus(false);
        const {form} = response;
        if(!form) return this.loadingStatus(false);
        this.instance!.meta
          ? this.editarMeta(form,this.meta!.met_id)
          : this.crearMeta(form);
        return this.loadingStatus(false);
      }
    });
  }

  startValidSub(){
    if(!this.instance)return;
    this.valid_sub = this.instance!.form.valueChanges
    .subscribe({
      next:()=>{
        const {form} = this.instance!;
        this.disabled = form.invalid;    
      }
    });
  }

  openForm() {
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:MetasFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{meta:this.meta},
      nzFooter:this.footerSaveTemplate,
      nzWidth:'500px',
      nzDraggable:true,
      nzMaskClosable:false,
      nzClosable:false
    });

    this.instance = this.modal.getContentComponent();    

    this.startModalSub();
    this.startValidSub();
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
    this.loadingStatus(true);
  }

  handleCancelar(){
    this.modal?.destroy({form:null});
  }
}
