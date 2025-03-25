import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ProfileComponent } from './features/user/profile/profile.component';
import { LoginComponent } from './features/auth/login.component';
import { CheckoutComponent } from './features/checkout/checkout/checkout.component';
import { paymentGuard } from './core/guards/payment.guard';
export const routes: Routes = [
  { 
    path: 'products', 
    loadChildren: () => import('./features/products/routes/routes.component').then(m => m.PRODUCTS_ROUTES)
  },
  { 
    
    path: '', 
    redirectTo: 'products', 
    pathMatch: 'full' 
  },
  {
  path: 'login', 
  component: LoginComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes/routes.component').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/routes/routes.component').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    component: ProfileComponent 
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [paymentGuard] // Protection par guard
  }

  
];