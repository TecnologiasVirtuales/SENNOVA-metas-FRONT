import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { P04CentroFormacionModel, P04DesercionesModel, P04FichaModel, P04JornadaModel, P04ModalidadModel, P04MunicipioModel, P04NivelModel, P04ProgramaModel, P04RegionalModel } from '@shared/models/p04.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';
import { ReporteChartModel } from '@shared/models/reporte-chart.model';

@Injectable({
  providedIn: 'root'
})
export class P04Service {

  private http = inject(HttpClient);
  private url = 'p04';

  upload(form_data:FormData){
    return this.http.post(`${this.url}/upload/`,form_data);
  }

  countProgramasMunicipio(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/count-programas-municipio/`, data);
    return this.http.get<ReporteChartModel>(url);
  }

  getDeserciones(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/deserciones/`, data);
    return this.http.get<P04DesercionesModel>(url);
  }

  getFichas(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/fichas/`, data);
    return this.http.get<PaginateModel<P04FichaModel>>(url);
  }

  getModalidades(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/modalidades/`, data);
    return this.http.get<PaginateModel<P04ModalidadModel>>(url);
  }

  getCentrosFormacion(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/centros-formacion/`, data);
    return this.http.get<PaginateModel<P04CentroFormacionModel>>(url);
  }

  getRegionales(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/regionales/`, data);
    return this.http.get<PaginateModel<P04RegionalModel>>(url);
  }

  getMunicipios(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/municipios/`, data);
    return this.http.get<PaginateModel<P04MunicipioModel>>(url);
  }

  getJornadas(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/jornadas/`, data);
    return this.http.get<PaginateModel<P04JornadaModel>>(url);
  }

  getProgramas(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/programas/`, data);
    return this.http.get<PaginateModel<P04ProgramaModel>>(url);
  }

  getNiveles(data?: QueryUrlModel) {
    const url: string = getQueryUrl(`${this.url}/niveles/`, data);
    return this.http.get<PaginateModel<P04NivelModel>>(url);
  }


}
