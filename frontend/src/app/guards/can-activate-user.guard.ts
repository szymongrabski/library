import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canActivateUserGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = authService.getUserRole();

  if (role === 'USER' || role === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/home']);
};
