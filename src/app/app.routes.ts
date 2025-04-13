import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ProfileComponent } from './features/user/profile/profile.component';
import { LoginComponent } from './features/auth/login.component';
import { CheckoutComponent } from './features/checkout/checkout/checkout.component';
import { paymentGuard } from './core/guards/payment.guard';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/user/carts/cart/cart.component';
import { CheckoutOrderComponent } from './features/checkout/checkout-order/checkout-order.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { CheckoutFormComponent } from './features/checkout/checkout-form/checkout-form.component';
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
  },
  { 
    path: 'product/:id', 
    component: ProductDetailComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: 'checkout-form',
    component: CheckoutFormComponent 
  },
  { 
    path: 'checkout-order', 
    component: CheckoutOrderComponent 
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [authGuard, adminGuard]
  }


  
];