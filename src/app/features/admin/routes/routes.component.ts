

import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductFormComponent } from '../products/product-form/product-form.component';

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
    path: 'products/new',
    component: ProductFormComponent
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent
  },

  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  }
];