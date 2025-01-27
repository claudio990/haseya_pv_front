import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authLoginGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if(!authService.noAuth())
  {
      console.log('hello');
      
  }
  return authService.noAuth()
};
