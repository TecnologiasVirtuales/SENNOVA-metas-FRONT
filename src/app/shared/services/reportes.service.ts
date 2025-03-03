import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FichasByModalidadModel } from '@shared/models/fichas-by-nivel-modalidad.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);
  private url:string = 'api/reportes';

  fichasByNivelModalidad(){
    return this.http.get<FichasByModalidadModel>(`${this.url}/fichas-by-nivel-modalidad`);
  }
}
