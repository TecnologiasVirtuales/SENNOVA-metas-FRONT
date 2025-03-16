import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash, lucidePlus, lucideSquarePen } from '@ng-icons/lucide';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { EstrategiaDetalleModel } from '@shared/models/estrategia-detalle.model';
import { EstrategiasDetalleService } from '@shared/services/estrategias-detalle.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { EstrategiaDetalleFormComponent } from '../estrategia-detalle-form/estrategia-detalle-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estrategia-detalle-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzFlexModule,
    ModalFooterComponent,
    NzAlertModule,
    NgIconComponent,
  ],
  templateUrl: './estrategia-detalle-actions.component.html',
  styleUrl: './estrategia-detalle-actions.component.css',
  viewProviders: [provideIcons({ 
    lucideTrash,
    lucidePlus,
    lucideSquarePen
  })]
})
export class EstrategiaDetalleActionsComponent {

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;
  
  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private detalles_service = inject(EstrategiasDetalleService);
  
  @Input() type_actions:'actualizar'|'eliminar'|'crear' = 'crear';
  @Input() long_title:boolean = false;
  @Input() icons:boolean = false;
  @Input() show_title:boolean = true;
  @Input() detalle?:EstrategiaDetalleModel;
  @Input() index?:number;

  @Output() create:EventEmitter<EstrategiaDetalleModel> = new EventEmitter();
  @Output() update:EventEmitter<{detalle:EstrategiaDetalleModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  save_loading:boolean = false;
  disabled:boolean = true;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;

  instance?:EstrategiaDetalleFormComponent;
  modal?: NzModalRef;

  get title(){
    let title:string = `${this.type_actions}${this.long_title?' meta estrategia':''}`;
    title = title.split(' ').map((w)=>{
      return w.split('').map((c,i)=>i==0?c.toUpperCase():c).join('');
    }).join(' ');
    return title;
  }

  get icon(){
    switch (this.type_actions) {
      case 'actualizar':
        return 'lucideSquarePen';
      case 'crear':
        return 'lucidePlus';
      case 'eliminar':
        return 'lucideTrash'
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.closeValidSub();
    this.closeModalSub();
    this.resetDataSub();
  }

  private startValidSub(){
    if(!this.instance)return;
    this.valid_sub = this.instance!.form.valueChanges
    .subscribe({
      next:()=>{
        const {form} = this.instance!;
        this.disabled = form.invalid;        
      }
    });
  }

  private startModalSub(){
    if(!this.instance)return;
    this.modal_sub = this.modal!.afterClose
    .subscribe({
      next:(response)=>{
        if(!response)return this.loadingStatus(false);
        const {form} = response;
        if(!form) return this.loadingStatus(false);
        this.instance!.detalle
          ? this.editarDetalle(form,this.detalle!.estd_id)
          : this.crearDetalle(form);
        return this.loadingStatus(false);
      }
    });
  }

  private closeValidSub(){
    if(this.valid_sub)this.valid_sub.unsubscribe();
  }

  private closeModalSub(){
    if(this.modal_sub)this.modal_sub.unsubscribe();
  }

  private resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

  private loadingStatus(status:boolean){
    this.save_loading = status;
    this.setLoading.emit(status);
  }

  private crearDetalle(form:EstrategiaDetalleModel){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.detalles_service.create(form)
      .subscribe({
        next:(response)=>{
          this.create.emit(response);
          this.loadingStatus(false);
        }
      });
  }

  private editarDetalle(form:EstrategiaDetalleModel,id:number){    
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.detalles_service.update(form,id)
      .subscribe({
        next:(response)=>{
          this.update.emit({detalle:response,index:this.index!});
          this.loadingStatus(false);
        }
      });
  }

  eliminarDetalle(){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.detalles_service.delete(this.detalle!.estd_id)
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
      nzContent:EstrategiaDetalleFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{detalle:this.detalle},
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
