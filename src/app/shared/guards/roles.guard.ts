import { computed, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export const rolesGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles: string[] = route.data['roles'] || [];

  return combineLatest({
    loading: toObservable(authService.loading_user),
    roles: toObservable(authService.roles),
    user: toObservable(authService.usuario)
  }).pipe(
    filter(({ loading, user }) => {
      return loading === false && !!user;
    }),
    take(1),
    map(({ roles, user }) => {
      if (!user) {
        return router.createUrlTree(['/errors', '401']);
      }
      if (user.is_superuser) {
        return true;
      }
      const allowed = allowedRoles.map(r => r.toLowerCase());
      const userRoles = roles.map(r => r.toLowerCase());
      const hasAllowedRole = allowed.some(r => userRoles.includes(r));
      return hasAllowedRole ? true : router.createUrlTree(['/errors', '401']);
    })
  );
};
