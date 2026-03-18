import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await authService.isAuthenticated();
  if (isAuthenticated) {
    router.navigate(['/dashboard/me']);
    return false;
  }
  return !isAuthenticated;
};
