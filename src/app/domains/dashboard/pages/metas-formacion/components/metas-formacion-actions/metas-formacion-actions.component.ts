import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Subscription } from 'rxjs';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { MetasFormacionFormComponent } from '../metas-formacion-form/metas-formacion-form.component';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { MetasFormacionService } from '@shared/services/metas-formacion.service';

@Component({
  selector: 'app-metas-formacion-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzFlexModule,
    NzIconModule,
    NzAlertModule,
    ModalFooterComponent
  ],
  templateUrl: './metas-formacion-actions.component.html',
  styleUrls: ['./metas-formacion-actions.component.css']
})
export class MetasFormacionActionsComponent implements OnInit, OnDestroy {

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;

  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  private metasFormacionService = inject(MetasFormacionService);

  @Input() type_actions: 'icons' | 'buttons' | 'create' = 'create';
  @Input() metaFormacion?: MetaFormacionModel;
  @Input() index?: number;

  @Output() create: EventEmitter<MetaFormacionModel> = new EventEmitter();
  @Output() update: EventEmitter<{ metaFormacion: MetaFormacionModel, index: number }> = new EventEmitter();
  @Output() delete: EventEmitter<number> = new EventEmitter();
  @Output() setLoading: EventEmitter<boolean> = new EventEmitter();

  title: 'Crear meta formación' | 'Editar meta formación' = 'Crear meta formación';
  icon: 'plus' | 'edit' = 'plus';
  save_loading: boolean = false;

  data_sub?: Subscription;
  valid_sub?: Subscription;
  modal_sub?: Subscription;
  disabled: boolean = true;

  instance?: MetasFormacionFormComponent;
  modal?: NzModalRef;

  ngOnInit(): void {
    if (this.metaFormacion) {
      this.title = 'Editar meta formación';
      this.icon = 'edit';
    }
  }

  ngOnDestroy(): void {
    this.closeValidSub();
    this.closeModalSub();
    this.resetDataSub();
  }

  startValidSub() {
    if (!this.instance) return;
    this.valid_sub = this.instance.form.valueChanges.subscribe({
      next: () => {
        const { form } = this.instance!;
        this.disabled = form.invalid;
      }
    });
  }

  startModalSub() {
    if (!this.instance) return;
    this.modal_sub = this.modal!.afterClose.subscribe({
      next: (response) => {
        if (!response) return this.loadingStatus(false);
        const { form } = response;
        if (!form) return this.loadingStatus(false);
        this.instance!.meta_formacion
          ? this.editarMetaFormacion(form, this.metaFormacion!.metd_id)
          : this.crearMetaFormacion(form);
        return this.loadingStatus(false);
      }
    });
  }

  closeValidSub() {
    if (this.valid_sub) this.valid_sub.unsubscribe();
  }

  closeModalSub() {
    if (this.modal_sub) this.modal_sub.unsubscribe();
  }

  resetDataSub() {
    if (this.data_sub) this.data_sub.unsubscribe();
  }

  loadingStatus(status: boolean) {
    this.save_loading = status;
    this.setLoading.emit(status);
  }

  crearMetaFormacion(form: MetaFormacionModel) {
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metasFormacionService.create(form)
      .subscribe({
        next: (response) => {
          this.create.emit(response);
          this.loadingStatus(false);
        }
      });
  }

  editarMetaFormacion(form: MetaFormacionModel, id: number) {
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metasFormacionService.update(form, id)
      .subscribe({
        next: (response) => {
          this.update.emit({ metaFormacion: response, index: this.index! });
          this.loadingStatus(false);
        }
      });
  }

  eliminarMetaFormacion() {
    this.loadingStatus(true);
    this.resetDataSub();
    this.data_sub = this.metasFormacionService.delete(this.metaFormacion!.metd_id)
      .subscribe({
        next: () => {
          this.delete.emit(this.index!);
          this.modal?.close();
          this.loadingStatus(false);
        }
      });
  }

  openForm() {
    this.modal = this.modal_service.create({
      nzTitle: this.title,
      nzContent: MetasFormacionFormComponent,
      nzViewContainerRef: this.view_container_ref,
      nzData: { metaFormacion: this.metaFormacion },
      nzFooter: this.footerSaveTemplate,
      nzWidth: '500px',
      nzDraggable: true,
      nzMaskClosable: false,
      nzClosable: false
    });
    this.instance = this.modal.getContentComponent();
    this.startModalSub();
    this.startValidSub();
  }

  onDelete() {
    this.modal = this.modal_service.create({
      nzContent: this.contentAlertTemplate,
      nzFooter: this.footerAlertTemplate,
      nzWidth: '400px',
      nzMaskClosable: false,
      nzClosable: false,
      nzDraggable: true
    });
  }

  handleGuardar() {
    this.instance?.submitForm();
    this.loadingStatus(true);
  }

  handleCancelar() {
    this.modal?.destroy({ form: null });
  }
}
