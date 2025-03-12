import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
import { PersonaModel } from '@shared/models/persona.model';
import { QueryUrlModel } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

  private http = inject(HttpClient);

  private url = 'api/admin/usuarios/'

   getAll(data?: QueryUrlModel) {
      let url: string = getQueryUrl(this.url, data);
      return this.http.get<PaginateModel<PersonaModel>>(url);
  }

}
