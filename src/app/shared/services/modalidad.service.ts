import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ModalidadModel } from '@shared/models/modalidad.model';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  http = inject(HttpClient);

  url = 'modalidades';

  getAll(){
    return this.http.get<ModalidadModel[]>(this.url);
  }
  
}
