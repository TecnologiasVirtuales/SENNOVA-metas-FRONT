import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDto } from '@shared/dto/login.dto';
import { RefreshDto } from '@shared/dto/refresh.dto';
import { TokenModel } from '@shared/models/token.model';
import { UsuarioModel } from '@shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  url = `auth`;

  login(credentials:LoginDto){
    return this.http.post<TokenModel>(`${this.url}/login`,credentials);
  }

  me(){
    return this.http.get<UsuarioModel>(`${this.url}/me`);
  }

  refresh(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/login/refresh`,token);
  }

  logOut(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/logout`,token);
  }

}
