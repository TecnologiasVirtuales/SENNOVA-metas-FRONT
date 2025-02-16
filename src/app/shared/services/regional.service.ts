import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegionalDto } from '@shared/dto/regional/regional.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrlModel } from '@shared/models/query-url.model';
import { RegionalModel } from '@shared/models/regional.model';

@Injectable({
  providedIn: 'root'
})
export class RegionalService {

  
  private http = inject(HttpClient);

  private url = 'regionales/';

  getAll(data?:QueryUrlModel){
    let url:string = getQueryUrl(this.url,data);
    return this.http.get<PaginateModel<RegionalModel>>(url);
  }

  create(form:RegionalDto){
    return this.http.post<RegionalModel>(`${this.url}`,form);
  }

  update(form:RegionalDto,id:number){
    return this.http.put<RegionalModel>(`${this.url}${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}${id}/`);
  }
}
