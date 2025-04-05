// src/app/features/products/routes/routes.ts
import { Route } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { DashboardComponent } from '../../admin/dashboard/dashboard.component';

export const PRODUCTS_ROUTES: Route[] = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  

];