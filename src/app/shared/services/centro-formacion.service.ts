import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CentroFormacionDto } from '@shared/dto/centro-formacion/centro-formacion.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class CentroFormacionService {

  private http = inject(HttpClient);

  private url = 'centros_formacion/';

  getAll(data?:QueryUrlModel){
    let url:string = getQueryUrl(this.url,data);
    return this.http.get<PaginateModel<CentroFormacionModel>>(this.url);
  }

  getOneById(id:number){
    return this.http.get<CentroFormacionModel>(`${this.url}${id}/`);
  }

  create(form:CentroFormacionDto){
    return this.http.post<CentroFormacionModel>(`${this.url}`,form);
  }

  update(form:CentroFormacionDto,id:number){
    return this.http.put<CentroFormacionModel>(`${this.url}${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}${id}/`);
  }
}
