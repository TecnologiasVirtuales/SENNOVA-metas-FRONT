import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NivelFormacionDto } from '@shared/dto/nivel-formacion/nivel-formacion.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class NivelFormacionService {

  private http = inject(HttpClient);

  private url = 'api/niveles_formacion/';

  getAll(data?:QueryUrlModel){
    let url:string = getQueryUrl(this.url,data);
    return this.http.get<PaginateModel<NivelFormacionModel>>(url);
  }

  getOneById(id:number){
    return this.http.get<NivelFormacionModel>(`${this.url}${id}/`);
  }

  create(form:NivelFormacionDto){
    return this.http.post<NivelFormacionModel>(`${this.url}`,form);
  }

  update(form:NivelFormacionDto,id:number){
    return this.http.put<NivelFormacionModel>(`${this.url}${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}${id}/`);
  }
}
