import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CentroFormacionDto } from '@shared/dto/centro-formacion/centro-formacion.dto';
import { CentroFormacionModel } from '@shared/models/centro-formacion.model';

@Injectable({
  providedIn: 'root'
})
export class CentroFormacionService {

  private http = inject(HttpClient);

  private url = 'centros_formacion';

  getAll(){
    return this.http.get<CentroFormacionModel[]>(this.url);
  }

  getOneById(id:number){
    return this.http.get<CentroFormacionModel>(`${this.url}/${id}/`);
  }

  getOneByCodigo(codigo:string){
    return this.http.get<CentroFormacionModel>(`${this.url}/codigo/${codigo}/`);
  }

  create(form:CentroFormacionDto){
    return this.http.post<CentroFormacionModel>(`${this.url}/`,form);
  }

  update(form:CentroFormacionDto,id:number){
    return this.http.put<CentroFormacionModel>(`${this.url}/${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}/`);
  }
}
