import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthStateService } from './auth-state.service';

/**
 * Guard that checks if the user is authenticated.
 * If the auth state hasn't been checked yet, it calls /me first.
 * Redirects to /login if not authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.checked()) {
    if (authState.isAuthenticated()) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  }

  // First load — check auth status via /me
  return authState.checkAuth().pipe(
    map(() => {
      if (authState.isAuthenticated()) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
  );
};

/**
 * Factory that creates a guard checking the user's role.
 * Must be used after authGuard in the canActivate array.
 */
export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    const role = authState.role();
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
}
