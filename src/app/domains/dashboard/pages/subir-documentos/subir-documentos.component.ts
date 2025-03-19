import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { Df14Service } from '@shared/services/documents/df14.service';
import { P04Service } from '@shared/services/documents/p04.service'; // Asegúrate de tener este servicio
import { NotificationNoteService } from '@shared/services/notification-note.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-subir-documentos',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzSpinModule,
    SenaLoadingComponent,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: './subir-documentos.component.html',
  styleUrls: ['./subir-documentos.component.css']
})
export class SubirDocumentosComponent implements OnDestroy {

  private notification_service = inject(NotificationNoteService);
  fb = inject(FormBuilder);
  df14_service = inject(Df14Service);
  p04_service = inject(P04Service);

  // Variable que guarda el valor seleccionado del tipo de documento
  nombre_documento?: string;

  form: FormGroup;
  form_loading: boolean = false;

  // Arrays separados para cada tipo de documento
  uploadedDF14Files: NzUploadFile[] = [];
  uploadedP04Files: NzUploadFile[] = [];

  upload_subs: Subscription[] = [];

  constructor(){
    this.form = this.fb.group({
      files: new FormControl([], [Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.upload_subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  // Propiedad para devolver el listado de archivos según el documento seleccionado
  get currentUploadedFiles(): NzUploadFile[] {
    if (this.nombre_documento === 'DF14') {
      return this.uploadedDF14Files;
    } else if (this.nombre_documento === 'P04') {
      return this.uploadedP04Files;
    }
    return [];
  }

  // Función que intercepta la selección de archivos y evita la subida automática
  beforeUpload = (file: NzUploadFile): boolean => {
    if (this.nombre_documento === 'DF14') {
      this.uploadedDF14Files = [...this.uploadedDF14Files, file];
    } else if (this.nombre_documento === 'P04') {
      this.uploadedP04Files = [...this.uploadedP04Files, file];
    }
    // Retornar false previene que el archivo se suba de inmediato
    return false;
  };

  // Función para enviar todos los archivos manualmente según el tipo de documento
  onSubmit(): void {
    if (!this.nombre_documento) {
      return;
    }
  
    let filesToUpload: NzUploadFile[] = [];
    let serviceToUse: any;
  
    if (this.nombre_documento === 'DF14') {
      filesToUpload = this.uploadedDF14Files;
      serviceToUse = this.df14_service;
    } else if (this.nombre_documento === 'P04') {
      filesToUpload = this.uploadedP04Files;
      serviceToUse = this.p04_service;
    }  
    if (!filesToUpload.length) {
      return;
    }
  
    const formData = new FormData();
    filesToUpload.forEach((file: NzUploadFile) => {
      const fileToUpload = file.originFileObj ? file.originFileObj : file;
      formData.append('files', fileToUpload as File);
    });
  
    this.form_loading = true;
  
    const uploadSub = serviceToUse.upload(formData)
      .pipe(finalize(() => this.form_loading = false))
      .subscribe({
        next: (response: any) => {
          if (this.nombre_documento === 'DF14') {
            this.uploadedDF14Files = [];
          } else if (this.nombre_documento === 'P04') {
            this.uploadedP04Files = [];
          }
        },
        complete:()=>{
          this.notification_service.success('Carga existosa','Los documentos se cargaron con exito');
        },
        error: () => {
          this.notification_service.error('Carga fallida','Error al cargar los documentos');
        }
      });
    this.upload_subs.push(uploadSub);
  }
}
