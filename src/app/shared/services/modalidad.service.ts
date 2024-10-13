import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ModalidadDto } from '@shared/dto/modalidad/modalidad.dto';
import { ModalidadModel } from '@shared/models/modalidad.model';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  private http = inject(HttpClient);

  private url = 'modalidades';

  getAll(){
    return this.http.get<ModalidadModel[]>(this.url);
  }

  getOneById(id:number){
    return this.http.get<ModalidadModel>(`${this.url}/${id}/`);
  }

  getOneByCodigo(codigo:string){
    return this.http.get<ModalidadModel>(`${this.url}/codigo/${codigo}/`);
  }

  create(form:ModalidadDto){
    return this.http.post<ModalidadModel>(`${this.url}/`,form);
  }

  update(form:ModalidadDto,id:number){
    return this.http.put<ModalidadModel>(`${this.url}/${id}/`,form);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}/`);
  }
  
}
