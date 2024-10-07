import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { LoginDto } from '@shared/dto/login.dto';
import { RefreshDto } from '@shared/dto/refresh.dto';
import { TokenModel } from '@shared/models/token.model';

const {api_url} = environment;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  url = `${api_url}/auth`;

  login(credentials:LoginDto){
    return this.http.post<TokenModel>(`${this.url}/login`,credentials);
  }

  me(){
    return 
  }

  refresh(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/login/refresh`,token);
  }

  logOut(token:RefreshDto){
    return this.http.post<TokenModel>(`${this.url}/logout`,token);
  }

}
