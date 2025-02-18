import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { BilinguismoModel } from '@shared/models/bilinguismo.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class BilinguismoService {

  private http = inject(HttpClient);

  private url = 'bilinguismo/';

  constructor() { }

  getAll(data?: QueryUrlModel) {
    let url: string = getQueryUrl(this.url, data);
    return this.http.get<PaginateModel<BilinguismoModel>>(url);
  }

  getOneById(id: number) {
    return this.http.get<BilinguismoModel>(`${this.url}/${id}/`);
  }

  create(form: BilinguismoModel) {
    return this.http.post<BilinguismoModel>(`${this.url}`, form);
  }

  update(form: BilinguismoModel, id: number) {
    return this.http.put<BilinguismoModel>(`${this.url}${id}/`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}/`);
  }
}