import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegionalDto } from '@shared/dto/regional/regional.dto';
import { RegionalModel } from '@shared/models/regional.model';

@Injectable({
  providedIn: 'root'
})
export class RegionalService {

  
  private http = inject(HttpClient);

  private url = 'regionales';

  getAll(){
    return this.http.get<RegionalModel[]>(this.url);
  }

  getOneById(id:number){
    return this.http.get<RegionalModel>(`${this.url}/${id}/`);
  }

  getOneByCodigo(codigo:string){
    return this.http.get<RegionalModel>(`${this.url}/codigo/${codigo}/`);
  }

  create(form:RegionalDto){
    console.log(form);
    return this.http.post<RegionalModel>(`${this.url}/`,form);
  }

  update(form:RegionalDto,id:number){
    return this.http.put<RegionalModel>(`${this.url}/${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}/`);
  }
}
