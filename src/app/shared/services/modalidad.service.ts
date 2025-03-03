import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ModalidadDto } from '@shared/dto/modalidad/modalidad.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { ModalidadModel } from '@shared/models/modalidad.model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  private http = inject(HttpClient);

  private url = 'api/modalidades/';

  getAll(data?:QueryUrlModel){
    let url:string = getQueryUrl(this.url,data);
    return this.http.get<PaginateModel<ModalidadModel>>(url);
  }

  getOneById(id:number){
    return this.http.get<ModalidadModel>(`${this.url}/${id}/`);
  }

  create(form:ModalidadDto){
    return this.http.post<ModalidadModel>(`${this.url}`,form);
  }

  update(form:ModalidadDto,id:number){
    return this.http.put<ModalidadModel>(`${this.url}${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}${id}/`);
  }
  
}
