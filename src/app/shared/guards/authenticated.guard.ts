import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TokenService } from '@shared/services/token.service';

export const authenticatedGuard: CanMatchFn = (route, segments) => {
  const token_service = inject(TokenService);
  const router = inject(Router);
  if(!token_service.getToken()){
    router.navigate(['/auth','inicio-sesion']);
    return false;
  }
  token_service.sessionExpire();
  return true;
};
