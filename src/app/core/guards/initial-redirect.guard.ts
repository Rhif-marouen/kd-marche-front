import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const initialRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const user = authService.user();
    user?.is_admin 
      ? router.navigate(['/admin/dashboard'])
      : router.navigate(['/profile']);
  } else {
    router.navigate(['/auth/login']);
  }
  
  return false;
};