import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subscription, debounceTime, skip } from 'rxjs';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { MetaModel } from '@shared/models/meta.model';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { MetasService } from '@shared/services/metas.service';
import { ModalidadService } from '@shared/services/modalidad.service';
import { CentroFormacionService } from '@shared/services/centro-formacion.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-metas-formacion-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
    NzSelectModule,
    NzSpinModule
  ],
  templateUrl: './metas-formacion-form.component.html',
  styleUrls: [
    './metas-formacion-form.component.css',
    '../../../../../../shared/styles/forms.style.css'

  ]
})
export class MetasFormacionFormComponent extends FormStyle implements OnInit, OnDestroy {

  private formBuilder = inject(FormBuilder);
  private metasService = inject(MetasService);
  private modalidadService = inject(ModalidadService);
  private centroService = inject(CentroFormacionService);
  private modal = inject(NzModalRef);

  form: FormGroup;

  meta_formacion?:MetaFormacionModel

  metas: MetaModel[] = [];
  is_loading_meta: boolean = true;
  page_meta: number = 1;
  num_meta: number = 10;
  search_meta: string = '';
  data_sub_meta?: Subscription;
  search_meta_sub?: Subscription;
  search_meta_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  modalidades: ModalidadModel[] = [];
  is_loading_modalidad: boolean = true;
  page_modalidad: number = 1;
  num_modalidad: number = 10;
  search_modalidad: string = '';
  data_sub_modalidad?: Subscription;
  search_modalidad_sub?: Subscription;
  search_modalidad_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  centros: CentroFormacionModel[] = [];
  is_loading_centro: boolean = true;
  page_centro: number = 1;
  num_centro: number = 10;
  search_centro: string = '';
  data_sub_centro?: Subscription;
  search_centro_sub?: Subscription;
  search_centro_subject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(){
    super();
    this.form = this.formBuilder.group({
      meta_id: new FormControl(null, [Validators.required]),
      modalidad_id: new FormControl(null, [Validators.required]),
      centro_de_formacion_id: new FormControl(null, [Validators.required]),
      met_formacion_operario: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_auxiliar: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_tecnico: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_profundizacion_tecnica: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_tecnologo: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_evento: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_curso_especial: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_bilinguismo: new FormControl(null, [Validators.required, Validators.min(1)]),
      met_formacion_sin_bilinguismo: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    this.startSearchMeta();
    this.startSearchModalidad();
    this.startSearchCentro();
    this.data_sub_meta = this.getMeta().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.metas = results;
        this.num_meta = count;
        this.is_loading_meta = false;
      }
    });
    this.data_sub_modalidad = this.getModalidad().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.modalidades = results;
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
    this.data_sub_centro = this.getCentro().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.centros = results;
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
    this.meta_formacion = this.modal.getConfig().nzData.meta_formacion;
    if (this.meta_formacion) {
      this.form.patchValue(this.meta_formacion);
    }
  }

  ngOnDestroy(): void {
    this.resetDataSubs();
    this.resetSearchSubs();
  }

  submitForm(): void {
    const { value, valid } = this.form;
    if(valid){
      this.modal.close({ form: value });
    }
  }

  get field_meta_id() { return this.form.get('meta_id') as FormControl<number>; }
  get field_modalidad_id() { return this.form.get('modalidad_id') as FormControl<number>; }
  get field_centro_de_formacion_id() { return this.form.get('centro_de_formacion_id') as FormControl<number>; }
  get field_met_formacion_operario() { return this.form.get('met_formacion_operario') as FormControl<number>; }
  get field_met_formacion_auxiliar() { return this.form.get('met_formacion_auxiliar') as FormControl<number>; }
  get field_met_formacion_tecnico() { return this.form.get('met_formacion_tecnico') as FormControl<number>; }
  get field_met_formacion_profundizacion_tecnica() { return this.form.get('met_formacion_profundizacion_tecnica') as FormControl<number>; }
  get field_met_formacion_tecnologo() { return this.form.get('met_formacion_tecnologo') as FormControl<number>; }
  get field_met_formacion_evento() { return this.form.get('met_formacion_evento') as FormControl<number>; }
  get field_met_formacion_curso_especial() { return this.form.get('met_formacion_curso_especial') as FormControl<number>; }
  get field_met_formacion_bilinguismo() { return this.form.get('met_formacion_bilinguismo') as FormControl<number>; }
  get field_met_formacion_sin_bilinguismo() { return this.form.get('met_formacion_sin_bilinguismo') as FormControl<number>; }

  getMeta(){
    const filters: { [key: string]: string | number } = {};
    if(this.search_meta.trim().length > 0){ filters['meta'] = this.search_meta; }
    return this.metasService.getAll({ filter: filters, page_number: this.page_meta });
  }

  onScrollMeta(): void {
    if(this.num_meta <= this.metas.length){ return; }
    this.resetDataSubMeta();
    this.is_loading_meta = true;
    this.page_meta++;
    this.data_sub_meta = this.getMeta().subscribe({
      next: (data) => {
        const { results } = data;
        this.metas = [...this.metas, ...results];
        this.is_loading_meta = false;
      }
    });
  }

  onSearchMeta(search: string): void {
    this.is_loading_meta = true;
    this.search_meta_subject.next(search);
  }

  executeSearchMeta(): void {
    this.resetDataSubMeta();
    this.page_meta = 1;
    this.data_sub_meta = this.getMeta().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.metas = results;
        this.num_meta = count;
        this.is_loading_meta = false;
      }
    });
  }

  startSearchMeta(): void {
    const search_wait = 200;
    const search_skip = 0;
    this.search_meta_sub = this.search_meta_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({
        next: (search) => {
          this.search_meta = search;
          this.executeSearchMeta();
        }
      });
  }

  resetDataSubMeta(): void {
    if(this.data_sub_meta){ this.data_sub_meta.unsubscribe(); }
  }

  getModalidad(){
    const filters: { [key: string]: string | number } = {};
    if(this.search_modalidad.trim().length > 0){ filters['modalidad'] = this.search_modalidad; }
    return this.modalidadService.getAll({ filter: filters, page_number: this.page_modalidad });
  }

  onScrollModalidad(): void {
    if(this.num_modalidad <= this.modalidades.length){ return; }
    this.resetDataSubModalidad();
    this.is_loading_modalidad = true;
    this.page_modalidad++;
    this.data_sub_modalidad = this.getModalidad().subscribe({
      next: (data) => {
        const { results } = data;
        this.modalidades = [...this.modalidades, ...results];
        this.is_loading_modalidad = false;
      }
    });
  }

  onSearchModalidad(search: string): void {
    this.is_loading_modalidad = true;
    this.search_modalidad_subject.next(search);
  }

  executeSearchModalidad(): void {
    this.resetDataSubModalidad();
    this.page_modalidad = 1;
    this.data_sub_modalidad = this.getModalidad().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.modalidades = results;
        this.num_modalidad = count;
        this.is_loading_modalidad = false;
      }
    });
  }

  startSearchModalidad(): void {
    const search_wait = 200;
    const search_skip = 0;
    this.search_modalidad_sub = this.search_modalidad_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({
        next: (search) => {
          this.search_modalidad = search;
          this.executeSearchModalidad();
        }
      });
  }

  resetDataSubModalidad(): void {
    if(this.data_sub_modalidad){ this.data_sub_modalidad.unsubscribe(); }
  }

  getCentro(){
    const filters: { [key: string]: string | number } = {};
    if(this.search_centro.trim().length > 0){ filters['centro'] = this.search_centro; }
    return this.centroService.getAll({ filter: filters, page_number: this.page_centro });
  }

  onScrollCentro(): void {
    if(this.num_centro <= this.centros.length){ return; }
    this.resetDataSubCentro();
    this.is_loading_centro = true;
    this.page_centro++;
    this.data_sub_centro = this.getCentro().subscribe({
      next: (data) => {
        const { results } = data;
        this.centros = [...this.centros, ...results];
        this.is_loading_centro = false;
      }
    });
  }

  onSearchCentro(search: string): void {
    this.is_loading_centro = true;
    this.search_centro_subject.next(search);
  }

  executeSearchCentro(): void {
    this.resetDataSubCentro();
    this.page_centro = 1;
    this.data_sub_centro = this.getCentro().subscribe({
      next: (data) => {
        const { results, count } = data;
        this.centros = results;
        this.num_centro = count;
        this.is_loading_centro = false;
      }
    });
  }

  startSearchCentro(): void {
    const search_wait = 200;
    const search_skip = 0;
    this.search_centro_sub = this.search_centro_subject
      .pipe(skip(search_skip), debounceTime(search_wait))
      .subscribe({
        next: (search) => {
          this.search_centro = search;
          this.executeSearchCentro();
        }
      });
  }

  resetDataSubCentro(): void {
    if(this.data_sub_centro){ this.data_sub_centro.unsubscribe(); }
  }

  resetDataSubs(): void {
    this.resetDataSubMeta();
    this.resetDataSubModalidad();
    this.resetDataSubCentro();
  }

  resetSearchSubs(): void {
    if(this.search_meta_sub){ this.search_meta_sub.unsubscribe(); }
    if(this.search_modalidad_sub){ this.search_modalidad_sub.unsubscribe(); }
    if(this.search_centro_sub){ this.search_centro_sub.unsubscribe(); }
  }
}
