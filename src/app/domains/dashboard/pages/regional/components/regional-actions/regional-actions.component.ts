import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { RegionalModel } from '@shared/models/regional.model';
import { RegionalService } from '@shared/services/regional.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { RegionalFormComponent } from '../regional-form/regional-form.component';
import { RegionalDto } from '@shared/dto/regional/regional.dto';

@Component({
  selector: 'app-regional-actions',
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
  templateUrl: './regional-actions.component.html',
  styleUrl: './regional-actions.component.css'
})
export class RegionalActionsComponent {
  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;


  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private regional_service = inject(RegionalService);

  @Input() type_actions:'icons'|'buttons'|'create' = 'create';
  @Input() regional?:RegionalModel;
  @Input() index?:number;

  @Output() create:EventEmitter<RegionalModel> = new EventEmitter();
  @Output() update:EventEmitter<{regional:RegionalModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  title: 'Crear regional'|'Editar regional' = 'Crear regional';
  icon: 'plus'|'edit' = 'plus';
  save_loading:boolean = false;


  validSub:Subscription|null = null;
  disabled:boolean = true;

  instance?:RegionalFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.regional) {      
      this.title = 'Editar regional';
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
      nzContent:RegionalFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{regional:this.regional},
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
          this.instance!.regional
            ? this.editarRegional(form,this.regional!.id)
            : this.crearRegional(form)
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

  eliminarRegional(){
    this.loadingStatus(true);
    const {id} = this.regional!;
    const deleteSub = this.regional_service.delete(id)
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

  editarRegional(form:RegionalDto,id:number){    
    this.loadingStatus(true);
    const editSub = this.regional_service.update(form,id)
      .subscribe({
        next:(regional)=>{
          this.update.emit({index:this.index!,regional:regional});
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

  crearRegional(form: RegionalDto) {
    this.loadingStatus(true);
    const createSub = this.regional_service.create(form)
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
