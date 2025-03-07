import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { Df14Service } from '@shared/services/documents/df14.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {NzUploadFile, NzUploadModule} from 'ng-zorro-antd/upload'
import { Subscription } from 'rxjs';

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
  styleUrl: './subir-documentos.component.css'
})
export class SubirDocumentosComponent implements OnDestroy {

  fb = inject(FormBuilder);
  df14_service = inject(Df14Service);

  nombre_documento?:string;

  form:FormGroup;
  fileList?:NzUploadFile[];
  form_loading:boolean = false;

  upload_subs:Subscription[] = [];
  uploaded_files:NzUploadFile[] = [];

  constructor(){
    this.form = this.fb.group({
      files:new FormControl([],[Validators.required])
    })
  }

  ngOnDestroy(): void {
      if (this.upload_subs.length) this.upload_subs.forEach((sub:Subscription)=>sub.unsubscribe());
  }

  onUpload = (item:any) =>{
    const form_data = new FormData();
    const {file} = item;
    
    form_data.append('files',item.file);

    this.upload(item,form_data);
    return this.upload_subs.at(-1)!;
  }

  upload(item:any,form_data:FormData){
    switch (this.nombre_documento) {
      case 'DF14':
        this.uploadDF14(item,form_data);
        break;
    
      default:
        break;
    }
  }

  uploadDF14(item:any,form_data:FormData){
    const upload_sub = this.df14_service.upload(form_data)
      .subscribe({
        next:(message:any)=>{
          item.onSuccess(message.message);
          this.addFileToList(item.file);
        },
        error:(error:any)=>{
          item.onError(error.error);
        }
      })
    this.upload_subs.push(upload_sub);
  }

  addFileToList(file:NzUploadFile){
    this.uploaded_files.push(file);
  }
}
