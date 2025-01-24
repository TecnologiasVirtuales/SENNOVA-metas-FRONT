import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { DF14CentroFormacionModel, DF14EstadoAprendizModel, DF14NivelFormacionModel, DF14ProgramaModel, DF14RegionalModel, DF14TipoDocumentoModel } from '@shared/models/df14.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Injectable({
  providedIn: 'root'
})
export class Df14Service {

  private http = inject(HttpClient);
  private url = 'df14'

  upload(form_data:FormData){
    return this.http.post(`${this.url}/upload/`,form_data);
  }

  countAprendicesPorEstado(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/count-aprendices-por-estado/`,data);
    return this.http.get<ReporteChartModel>(url);
  }

  getRegionales(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-regionales/`,data);
    return this.http.get<PaginateModel<DF14RegionalModel>>(url);
  }

  getCentrosFormacion(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-centros-formacion/`,data);
    return this.http.get<PaginateModel<DF14CentroFormacionModel>>(url);
  }

  getNivelesFormacion(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-niveles-formacion/`,data);
    return this.http.get<PaginateModel<DF14NivelFormacionModel>>(url);
  }

  getProgramas(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-programas/`,data);
    return this.http.get<PaginateModel<DF14ProgramaModel>>(url);
  }

  getEstadosAprendiz(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-estados-aprendiz/`,data);
    return this.http.get<PaginateModel<DF14EstadoAprendizModel>>(url);
  }

  getTiposDocumento(data?:QueryUrlModel){
    let url:string = getQueryUrl(`${this.url}/get-tipos-documento/`,data);
    return this.http.get<PaginateModel<DF14TipoDocumentoModel>>(url);
  }
}
