import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, PublicProduct, PaginatedResponse } from '../models/product.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminProductsService {
  private http = inject(HttpClient);


  getProducts(page: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${environment.apiUrl}/admin/products`, // Ajouter /api
      { params: new HttpParams().set('page', page.toString()) }
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/products/${id}`);
  }

  updateProduct(id: number, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/admin/products/${id}`, data);
  }
  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(
      `${environment.apiUrl}/admin/products`,
      productData
    );
  }
}