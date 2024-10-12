import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginDto } from '@shared/dto/auth/login.dto';
import { RefreshDto } from '@shared/dto/auth/refresh.dto';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { MessageInfoModel } from '@shared/models/message-info.model';
import { TokenModel } from '@shared/models/token.model';
import { UsuarioModel } from '@shared/models/usuario.model';
import { TokenService } from './token.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private token_service = inject(TokenService);

  private url = `auth`;

  usuario = signal<UsuarioModel|null>(null);

  login(credentials:LoginDto){
    return this.http.post<TokenModel>(`${this.url}/login`,credentials)
      .pipe(map((token)=>{
        this.token_service.setToken(token);
        return token;
      }));
  }

  me(){
    return this.http.get<UsuarioModel>(`${this.url}/me`);
  }

  refresh(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/login/refresh`,token);
  }

  logOut(token:RefreshDto){
    return this.http.post<MessageInfoModel>(`${this.url}/logout`,token)
      .pipe(map((message)=>{
        this.token_service.deleteToken();
        this.usuario.set(null);
        return message;
      }));
  }

  register(formData:RegisterDto){
    return this.http.post<MessageInfoModel>(`${this.url}`,formData);
  }

}
