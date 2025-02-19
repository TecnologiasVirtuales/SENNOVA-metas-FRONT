import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { MetaModel } from '@shared/models/metas.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class MetasService {

  private http = inject(HttpClient);

  private url = 'metas';

  constructor() { }

  getAll(data?: QueryUrlModel) {
    let url: string = getQueryUrl(this.url, data);
    return this.http.get<PaginateModel<MetaModel>>(url);
  }

  getOneById(id: number) {
    return this.http.get<MetaModel>(`${this.url}/${id}/`);
  }

  create(form: MetaModel) {
    return this.http.post<MetaModel>(`${this.url}`, form);
  }

  update(form: MetaModel, id: number) {
    return this.http.put<MetaModel>(`${this.url}${id}/`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }
}
