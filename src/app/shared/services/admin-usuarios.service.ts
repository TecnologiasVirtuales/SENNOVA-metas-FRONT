import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
import { PersonaModel } from '@shared/models/persona.model';
import { QueryUrlModel } from '@shared/models/query-url.model';
import { RolePersonaModel } from '@shared/models/role.model';

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

  toggleUser(document:number) {
    let url: string = `${this.url}desactivar/${document}/`;
    return this.http.post<PersonaModel>(url,{});
  }

  create(usuario:RegisterDto){
    let url: string = `${this.url}register`;
    return this.http.post<PersonaModel>(url,usuario);
  }

  userRoles(document:number){
    let url:string = `${this.url}roles/${document}/`;
    return this.http.get<RolePersonaModel[]>(url);
  }

}
