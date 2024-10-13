import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartamentoModel } from '@shared/models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private http = inject(HttpClient);

  private url = 'departamentos'

  getAll(){
    return this.http.get<DepartamentoModel[]>(this.url);
  }

}
