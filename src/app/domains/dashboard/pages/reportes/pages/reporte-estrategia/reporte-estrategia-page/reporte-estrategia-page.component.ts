import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BarCharNivelModalidadComponent } from '../components/bar-char-nivel-modalidad/bar-char-nivel-modalidad.component';
import { P04Service } from '@shared/services/documents/p04.service';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';
import { BehaviorSubject, debounceTime, forkJoin, skip, Subscription } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { ValueReportePipe } from '@shared/pipes/value-reporte.pipe';
import { EstrategiasService } from '@shared/services/estrategias.service';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { formatDateToString } from '@shared/functions/date.functions';
import { ExtractSubReportesPipe } from '@shared/pipes/extract-sub-reportes.pipe';

@Component({
  selector: 'app-reporte-estrategia-page',
  standalone: true,
  imports: [
    CommonModule,
    BarCharNivelModalidadComponent,
    NzCardModule,
    ValueReportePipe,
    NzGridModule,
    NzCarouselModule,
    NzSelectModule,
    FormsModule,
    NzSpinModule,
    NzDatePickerModule,
    NzCarouselModule,
    ExtractSubReportesPipe
  ],
  templateUrl: './reporte-estrategia-page.component.html',
  styleUrl: './reporte-estrategia-page.component.css'
})
export class ReporteEstrategiaPageComponent  implements OnInit,OnDestroy{

  private p04_service = inject(P04Service);
  private estrategia_service = inject(EstrategiasService);

  estrategia?:string;
  estrategias:EstrategiaModel[] = [];
  is_loading_estrategia:boolean = false;
  page_estrategia:number = 1;
  num_estrategia:number = 10;
  search_estrategia?:string;
  search_estrategia_sub?:Subscription;
  search_estrategia_subject:BehaviorSubject<string> = new BehaviorSubject<string>('');

  reporte:ReporteChartModel = {}
  metas:ReporteChartModel = {};

  data_sub?:Subscription;

  fecha_inicio?:Date;
  fecha_fin?:Date;

  ngOnInit(): void {
    this.data_sub = forkJoin([
      this.getEstrategia()
    ]).subscribe({
      next:([estrategia_p])=>{
        let {results,count} = estrategia_p;
        this.estrategias = [...results];
        this.num_estrategia = count;
        if(this.estrategias.length) this.estrategia = this.estrategias[0].est_nombre;
        this.startSearch();
      },
      complete:()=>{
        this.loadData();
      }
    })
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearchSub();
  }

  get filters():{[key:string]:number|string}{
    let filters:{[key:string]:string|number} = {};
    if(this.estrategia) filters['estrategia.est_nombre'] = this.estrategia;
    if(this.fecha_inicio){
      filters['meta.met_fecha_inicio'] = formatDateToString(this.fecha_inicio);
      filters['fecha_inicio_ficha'] = formatDateToString(this.fecha_inicio);
    }
    if(this.fecha_fin){
      filters['meta.met_fecha_fin'] = formatDateToString(this.fecha_fin);
      filters['fecha_terminacion_ficha'] = formatDateToString(this.fecha_fin);
    }
    return filters;
  }

  get reportes_nivel(){
    return Object.entries(this.reporte).map(([nivel,value])=>({[nivel]:value}));
  }

  get metas_nivel(){
    return Object.entries(this.metas).map(([nivel,value])=>({[nivel]:value}));
  }
  
  get niveles(){
    return Object.keys(this.reporte);
  }

  get modalidades(){
    if(!this.reportes_nivel.at(0)!) return [];
    let nivel = Object.keys(this.reportes_nivel.at(0)!).at(0)!;
    let reporte = this.reportes_nivel.at(0)!;
    return Object.keys(reporte[nivel]);
  }

  private loadData(){
    this.data_sub = forkJoin([
      this.getReporte(),
      this.getMetas()
    ])
      .subscribe({
        next:([reporte,metas])=>{
          this.reporte = {...reporte};
          this.metas = {...metas};                    
        }
      });
  }

  private getReporte(){
    return this.p04_service.countAprendicesEstrategia({filter:this.filters});
  }

  private getMetas(){
    return this.p04_service.countMetasEstrategia({filter:this.filters});
  }

  private getEstrategia(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_estrategia && this.search_estrategia.trim().length > 0) filters['est_nombre'] = this.search_estrategia;
    return this.estrategia_service.getAll({filter:filters,page_number:this.page_estrategia});
  }

  onChangeEstrategia(){
    this.loadData();
  }

  onChangeInicio(){
    this.loadData();
  }

  onChangeFin(){
    this.loadData();
  }

  onScrollEstrategia(){
    if(this.num_estrategia <= this.estrategias.length) return;
    this.resetDataSub();
    this.is_loading_estrategia = true;
    this.page_estrategia = this.page_estrategia + 1;
    this.data_sub = this.getEstrategia()
      .subscribe({
        next:(p_estrategia)=>{
          let {results} = p_estrategia;
          this.estrategias = [...this.estrategias,...results];
          this.is_loading_estrategia = false;
        }
      });
  }

  onSearchEstrategia(search:string){
    this.is_loading_estrategia = true;    
    this.search_estrategia_subject.next(search);
  }

  private executeSearchEstrategia(){
    this.resetDataSub();
    this.page_estrategia = 1;
    this.data_sub = this.getEstrategia().subscribe({
      next:(p_estrategia)=>{
        let {results,count} = p_estrategia;        
        this.estrategias = [...results];
        this.num_estrategia = count;
        this.is_loading_estrategia = false;
      }
    });
  }

  private resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

  private resetSearchSub(){
    if(this.search_estrategia_sub)this.search_estrategia_sub.unsubscribe();
  }


  private startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 0;

    this.search_estrategia_sub = this.search_estrategia_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{          
          this.search_estrategia = search;
          this.executeSearchEstrategia();
        }
      });
}
  
}
