import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChangeRolesDto } from '@shared/dto/auth/change-roles.dto';
import { RolePersonaModel } from '@shared/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AdminRolesUsuarioService {

  private http = inject(HttpClient);

  private url = 'api/admin/roles_usuario/'

  changeRoles(document:number,form:ChangeRolesDto){
    let url:string = `${this.url}${document}/asignar/`;
    return this.http.post<RolePersonaModel>(url,form);
  }
}
