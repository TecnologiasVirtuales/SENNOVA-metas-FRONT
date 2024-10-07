import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@shared/services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token_service = inject(TokenService);
  if(!token_service.getToken()) return next(req);
  let auth_headers = new HttpHeaders();
  req = req.clone({
    headers: auth_headers.set(
      'authorization',
      token_service.getToken()!
    )
  });
  return next(req);
};
