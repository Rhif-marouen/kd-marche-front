// src/app/features/auth/routes.ts
import { Route } from '@angular/router';
import { LoginComponent } from '../login.component';
import { RegisterComponent } from '../register.component';
import { subscriptionGuard } from '../../../core/guards/subscription.guard';
import { CheckoutComponent } from '../../checkout/checkout/checkout.component';
import { paymentGuard } from '../../../core/guards/payment.guard';

export const AUTH_ROUTES: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

];