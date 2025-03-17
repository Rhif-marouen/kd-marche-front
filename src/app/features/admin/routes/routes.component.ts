

import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductsListComponent } from '../products-list/products-list.component';

export const ADMIN_ROUTES: Route[] = [
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'products',
    component: ProductsListComponent 
  },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  }
];