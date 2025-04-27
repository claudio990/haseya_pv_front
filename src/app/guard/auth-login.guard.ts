import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.noAuth()) {
    // Usuario SI tiene token
    return true;
  } else {
    // Usuario NO tiene token, mandarlo a login
    router.navigate(['/login']);
    return false;
  }
};
