import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const needsAuth = ![
    '/auth/login',
    '/auth/register',
    '/public/products'
  ].some(path => req.url.includes(path));

  if (needsAuth) {
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`)
    });
    return next(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 401) authService.logout();
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};