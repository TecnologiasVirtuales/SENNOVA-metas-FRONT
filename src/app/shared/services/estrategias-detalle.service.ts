import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { EstrategiaDetalleModel } from '@shared/models/estrategia-detalle.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class EstrategiasDetalleService {

  private http = inject(HttpClient);

  private url = 'api/estrategias_detalle/';

  getAll(data?: QueryUrlModel) {
    let url: string = getQueryUrl(this.url, data);
    return this.http.get<PaginateModel<EstrategiaDetalleModel>>(url);
  }

  getOneById(id: number) {
    return this.http.get<EstrategiaDetalleModel>(`${this.url}/${id}/`);
  }

  create(form: EstrategiaDetalleModel) {
    return this.http.post<EstrategiaDetalleModel>(`${this.url}`, form);
  }

  update(form: EstrategiaDetalleModel, id: number) {
    return this.http.put<EstrategiaDetalleModel>(`${this.url}${id}/`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }
}
