import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { MetaFormacionModel } from '@shared/models/meta-formacion.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class MetasFormacionService {

    private http = inject(HttpClient);
  
    private url = 'api/metas_formacion/';
  
    constructor() { }
  
    getAll(data?: QueryUrlModel) {
      let url: string = getQueryUrl(this.url, data);
      return this.http.get<PaginateModel<MetaFormacionModel>>(url);
    }
  
    getOneById(id: number) {
      return this.http.get<MetaFormacionModel>(`${this.url}/${id}/`);
    }
  
    create(form: MetaFormacionModel) {
      return this.http.post<MetaFormacionModel>(`${this.url}`, form);
    }
  
    update(form: MetaFormacionModel, id: number) {
      return this.http.put<MetaFormacionModel>(`${this.url}${id}/`, form);
    }
  
    delete(id: number) {
      return this.http.delete(`${this.url}${id}/`);
    }
}
