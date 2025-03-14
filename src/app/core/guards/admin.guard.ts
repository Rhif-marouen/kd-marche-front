import { CanActivateFn, ROUTES} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const adminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  return authService.isAdmin();
};
