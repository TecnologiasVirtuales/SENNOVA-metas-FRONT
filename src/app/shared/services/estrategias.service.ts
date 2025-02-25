import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class EstrategiasService {

    private http = inject(HttpClient);
  
    private url = 'estrategias/';
  
    getAll(data?: QueryUrlModel) {
      let url: string = getQueryUrl(this.url, data);
      return this.http.get<PaginateModel<EstrategiaModel>>(url);
    }
  
    getOneById(id: number) {
      return this.http.get<EstrategiaModel>(`${this.url}/${id}/`);
    }
  
    create(form: EstrategiaModel) {
      return this.http.post<EstrategiaModel>(`${this.url}`, form);
    }
  
    update(form: EstrategiaModel, id: number) {
      return this.http.put<EstrategiaModel>(`${this.url}${id}/`, form);
    }
  
    delete(id: number) {
      return this.http.delete(`${this.url}${id}/`);
    }

}
