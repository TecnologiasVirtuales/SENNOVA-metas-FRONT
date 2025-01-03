import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Df14Service {

  private http = inject(HttpClient);
  private url = 'df14'

  upload(form_data:FormData){
    return this.http.post(`${this.url}/upload/`,form_data);
  }
}
