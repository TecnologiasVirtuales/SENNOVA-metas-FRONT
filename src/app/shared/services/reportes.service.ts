import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);
  private url:string = 'reportes';

  fichasByNivelModalidad(){
    return this.http.get(`${this.url}/fichas-by-nivel-modalidad`);
  }
}
