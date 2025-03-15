import { CanActivateFn, Router, ROUTES} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAdmin()) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};