import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

export const rolesGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data['roles'] || [];

  const user = authService.usuario;
  const roles = authService.roles();
  const super_user = computed(()=>user() ? user()!.is_superuser : false)  

  if(Boolean(user())) return false;
  
  if (super_user()) {
    return true;
  }

  const allowed = allowedRoles.map(r => r.toLowerCase());
  const userRoles = roles.map(r => r.toLowerCase());

  const hasAllowedRole = allowed.some(r => userRoles.includes(r));
  
  if(!hasAllowedRole) router.navigate(['/errors','401']);

  return true;
};
