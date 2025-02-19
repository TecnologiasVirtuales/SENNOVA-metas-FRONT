import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { BilinguismoModel } from '@shared/models/bilinguismo.model';
import { BilinguismoService } from '@shared/services/bilinguismo.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { BilinguismoFormComponent } from '../bilinguismo-form/bilinguismo-form.component';

@Component({
  selector: 'app-bilinguismo-actions',
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
  templateUrl: './bilinguismo-actions.component.html',
  styleUrl: './bilinguismo-actions.component.css'
})
export class BilinguismoActionsComponent implements OnInit,OnDestroy{

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;

  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private bilinguismo_service = inject(BilinguismoService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() programa?:BilinguismoModel;
  @Input() index?:number;

  @Output() create:EventEmitter<BilinguismoModel> = new EventEmitter();
  @Output() update:EventEmitter<{bilinguismo:BilinguismoModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  title: 'Crear programa'|'Editar programa' = 'Crear programa';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;
  disabled:boolean = true;

  instance?:BilinguismoFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.programa) {      
      this.title = 'Editar programa';
      this.icon = 'edit';
    }
  }

  ngOnDestroy(): void {
    this.closeValidSub();
    this.resetDataSub();
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

  startModalSub(){
    if(!this.instance)return;
    this.modal_sub = this.modal!.afterClose
    .subscribe({
      next:(response)=>{
        if(!response)return this.loadingStatus(false);
        const {form} = response;
        if(!form) return this.loadingStatus(false);
        this.instance!.bilinguismo
          ? this.editarPrograma(form,this.programa!.bil_codigo)
          : this.crearPrograma(form);
        return this.loadingStatus(false);
      }
    });
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

  crearPrograma(form:BilinguismoModel){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.bilinguismo_service.create(form)
      .subscribe({
        next:(response)=>{
          this.create.emit(response);
          this.loadingStatus(false);
        }
      });
  }

  editarPrograma(form:BilinguismoModel,id:number){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.bilinguismo_service.update(form,id)
      .subscribe({
        next:(response)=>{
          console.log(response);
          this.update.emit({bilinguismo:response,index:this.index!});
          this.loadingStatus(false);
        }
      });
  }

  eliminarPrograma(){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.bilinguismo_service.delete(this.programa!.bil_codigo)
      .subscribe({
        next:()=>{
          this.delete.emit(this.index!);
          this.modal?.close();
          this.loadingStatus(false);
        }
      });
  }

  openForm() {
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:BilinguismoFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{programa:this.programa},
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
