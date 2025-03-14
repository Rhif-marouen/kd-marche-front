// src/app/features/auth/routes.ts
import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductListComponent } from '../../products/product-list/product-list.component';
import { UsersListComponent } from '../users-list/users-list.component';
export const ADMIN_ROUTES: Route[] = [
  { path: 'dashboard', component:DashboardComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'products',component: ProductListComponent}
];
