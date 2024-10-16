import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NivelFormacionDto } from '@shared/dto/nivel-formacion/nivel-formacion.dto';
import { NivelFormacionModel } from '@shared/models/nivel-formacion.model';

@Injectable({
  providedIn: 'root'
})
export class NivelFormacionService {

  private http = inject(HttpClient);

  private url = 'niveles_formacion';

  getAll(){
    return this.http.get<NivelFormacionModel[]>(this.url);
  }

  getOneById(id:number){
    return this.http.get<NivelFormacionModel>(`${this.url}/${id}/`);
  }

  getOneByCodigo(codigo:string){
    return this.http.get<NivelFormacionModel>(`${this.url}/codigo/${codigo}/`);
  }

  create(form:NivelFormacionDto){
    return this.http.post<NivelFormacionModel>(`${this.url}/`,form);
  }

  update(form:NivelFormacionDto,id:number){
    return this.http.put<NivelFormacionModel>(`${this.url}/${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}/`);
  }
}
