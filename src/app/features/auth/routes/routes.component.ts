// src/app/features/auth/routes.ts
import { Route } from '@angular/router';
import { LoginComponent } from '../login.component';
import { RegisterComponent } from '../register.component';

export const AUTH_ROUTES: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];