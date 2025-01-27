import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionsGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router)

  if(!authService.isAuth())
  {
      console.log('hello');
      
  }
  
  return authService.isAuth()
};
