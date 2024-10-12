import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenModel } from '@shared/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private router = inject(Router);

  session_time = signal<number>(
    parseInt(localStorage.getItem('token_exp') ?? '0')
  );
  sesion_date = signal<Date>(new Date());

  setToken(token: TokenModel) {
    localStorage.setItem('token', `${token.token_type} ${token.access_token}`);
    localStorage.setItem('refresh', `${token.refresh_token}`);
    let now = new Date();
    let exp_date = new Date(now.getTime() + token.expires_in * 1000);
    localStorage.setItem('token_exp', exp_date.toISOString());
    this.session_time.set(token.expires_in);
    this.sessionExpire();
  }

  sessionExpire() {
    let exp = new Date(localStorage.getItem('token_exp') as string);

    if (exp) {
      let session_time = setInterval(() => {
        let now = new Date();
        let time = Math.ceil((exp.getTime() - now.getTime()) / 1000);
        this.session_time.update(() => (time >= 0 ? time : 0));
        if (time <= 0 || !this.getToken()) {
          clearInterval(session_time);
          this.deleteToken();
          this.router.navigate(['/auth','inicio-sesion']);
          return;
        }
      }, 1000);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token_exp');
    this.router.navigate(['/auth','inicio-sesion']);
  }
}
