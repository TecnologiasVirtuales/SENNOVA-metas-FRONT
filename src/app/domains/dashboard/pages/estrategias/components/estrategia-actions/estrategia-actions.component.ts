import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSquarePen, lucideTrash } from '@ng-icons/lucide';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { EstrategiasService } from '@shared/services/estrategias.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { EstrategiaFormComponent } from '../estrategia-form/estrategia-form.component';

@Component({
  selector: 'app-estrategia-actions',
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
  templateUrl: './estrategia-actions.component.html',
  styleUrl: './estrategia-actions.component.css',
  viewProviders: [provideIcons({ 
    lucideTrash,
    lucidePlus,
    lucideSquarePen
  })]
})
export class EstrategiaActionsComponent implements OnInit,OnDestroy{
  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;
  
  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private estrategia_service = inject(EstrategiasService);

  @Input() type_actions:'actualizar'|'eliminar'|'crear' = 'crear';
  @Input() long_title:boolean = false;
  @Input() icons:boolean = false;
  @Input() show_title:boolean = true;
  @Input() estrategia?:EstrategiaModel;
  @Input() index?:number;

  @Output() create:EventEmitter<EstrategiaModel> = new EventEmitter();
  @Output() update:EventEmitter<{estrategia:EstrategiaModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  save_loading:boolean = false;
  disabled:boolean = true;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;

  instance?:EstrategiaFormComponent;
  modal?: NzModalRef;
  
  get title(){
    let title:string = `${this.type_actions}${this.long_title?' estrategia':''}`;
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
        this.instance!.estrategia
          ? this.editarEstrategia(form,this.estrategia!.est_id)
          : this.crearEstrategia(form);
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

  private crearEstrategia(form:EstrategiaModel){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.estrategia_service.create(form)
      .subscribe({
        next:(response)=>{
          this.create.emit(response);
          this.loadingStatus(false);
        }
      });
  }

  private editarEstrategia(form:EstrategiaModel,id:number){
    console.log(this.estrategia);
    
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.estrategia_service.update(form,id)
      .subscribe({
        next:(response)=>{
          this.update.emit({estrategia:response,index:this.index!});
          this.loadingStatus(false);
        }
      });
  }

  eliminarEstrategia(){
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.estrategia_service.delete(this.estrategia!.est_id)
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
      nzContent:EstrategiaFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{estrategia:this.estrategia},
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
