import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginDto } from '@shared/dto/auth/login.dto';
import { RefreshDto } from '@shared/dto/auth/refresh.dto';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { MessageInfoModel } from '@shared/models/message-info.model';
import { TokenModel } from '@shared/models/token.model';
import { PersonaModel } from '@shared/models/persona.model';
import { TokenService } from './token.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private token_service = inject(TokenService);

  private url = `auth`;

  usuario = signal<PersonaModel|null>(null);
  loading_user = signal<boolean>(true);

  login(credentials:LoginDto){
    return this.http.post<TokenModel>(`${this.url}/login`,credentials)
      .pipe(map((token)=>{
        this.token_service.setToken(token);
        this.loading_user.set(true);
        return token;
      }));
  }

  me(){
    return this.http.get<PersonaModel>(`${this.url}/me`);
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
