import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BilinguismoModel } from '@shared/models/bilinguismo.model';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { ModalidadService } from '@shared/services/modalidad.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { BehaviorSubject, debounceTime, skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-bilinguismo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
  ],
  templateUrl: './bilinguismo-form.component.html',
  styleUrls:[
    './bilinguismo-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class BilinguismoFormComponent extends FormStyle implements OnInit,OnDestroy{

  private form_builder = inject(FormBuilder);
  private modalidad_service = inject(ModalidadService);
  private modal = inject(NzModalRef);

  form:FormGroup;

  bilinguismo?:BilinguismoModel;

  modalidades:ModalidadModel[] = [];
  is_loading_modalidad:boolean = false;
  page_modalidad:number =1;
  num_modalidad:number = 10;
  search_modalidad:string = '';
  data_sub?:Subscription;
  search_modalidad_sub?:Subscription;
  search_modalidad_subject:BehaviorSubject<string>  = new BehaviorSubject<string>('');

  constructor(){
    super();
    this.form = this.form_builder.group({
      bil_codigo:new FormControl(null,[
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ]),
      bil_programa:new FormControl(null,[
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(5),
        noWhiteSpaceValidator()
      ]),
      bil_duracion:new FormControl(null,[
        Validators.required,
        Validators.min(1),      
      ]),
      modalidad_id:new FormControl(null,[
        Validators.required,
      ]),
      bil_version:new FormControl(null,[
        Validators.required,
        Validators.min(1),      
      ]),
    });
  }

  ngOnInit(): void {
    this.startSearch();
    this.bilinguismo = this.modal.getConfig().nzData.bilinguismo;
    if (this.bilinguismo) {
      const {bil_codigo,bil_programa} = this.bilinguismo;
      this.field_programa.setValue(bil_programa);
    }
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearch();
  }

  submitForm(){    
    const {value,valid} = this.form;
    if(valid){
      this.field_programa.setValue(this.field_programa.value.trim().toUpperCase());
      this.modal.close({form:value});
    }
  }

  get field_codigo(){
    return this.form.get('bil_codigo') as FormControl<string>;
  }

  get field_programa(){
    return this.form.get('bil_programa') as FormControl<string>;
  }

  get field_version(){
    return this.form.get('bil_version') as FormControl<number>;
  }

  get field_duracion(){
    return this.form.get('bil_duracion') as FormControl<number>;
  }

  get field_modalidad(){
    return this.form.get('modalidad_id') as FormControl<number>;
  }

  getModalidad(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_modalidad.length > 0) filters['modalidad'] = this.search_modalidad;
    return this.modalidad_service.getAll({filter:filters,page_number:this.page_modalidad});
  }

  onScrollModalidad(){
    if(this.num_modalidad <= this.modalidades.length) return;
    this.resetDataSub();
    this.is_loading_modalidad = true;
    this.page_modalidad++;
    this.data_sub = this.getModalidad()
      .subscribe({
        next:(p_modalidad)=>{
          let {results} = p_modalidad;
          this.modalidades = [...this.modalidades,...results];
          this.is_loading_modalidad = false;
        }
      });
  }

  onSearchModalidad(search:string){
    this.is_loading_modalidad = true;
    this.search_modalidad_subject.next(search);
  }

  executeSearchModalidad(){
    this.resetDataSub();
    this.page_modalidad = 1;
    this.data_sub = this.getModalidad().subscribe({
      next:(p_modalidad)=>{
        let {results,count} = p_modalidad;
        this.modalidades = [...results];
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
  }

  startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 0;

    this.search_modalidad_sub = this.search_modalidad_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{
          this.search_modalidad = search;
          this.executeSearchModalidad();
        }
      })
  }

  resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

  resetSearch(){
    if(this.search_modalidad_sub)this.search_modalidad_sub.unsubscribe();  
  }
}
