import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, PublicProduct, PaginatedResponse } from '../models/product.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); 

  getPublicProducts(page: number = 1): Observable<PaginatedResponse<PublicProduct>> {
    return this.http.get<PaginatedResponse<PublicProduct>>(
      `${environment.apiUrl}/public/products`,
      { params: { page } }
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/products/${id}` // Utiliser le bon endpoint
    );
  }
  getProducts(page: number = 1): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${environment.apiUrl}/products`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        },
        params: { page }
      }
    );
  }
}

/*
  getAdminProducts(page: number = 1): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${environment.apiUrl}/admin/products`,
      { params: { page } }
    );
  }  

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(
      `${environment.apiUrl}/admin/products`,
      productData
    );
  } */


export { PaginatedResponse };