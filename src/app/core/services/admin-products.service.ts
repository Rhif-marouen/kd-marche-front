import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse, Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  private apiUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) { }

  getProducts(page: number, perPage: number = 12,searchQuery?:string): Observable<PaginatedResponse<Product>> {
    const params: any = { page, per_page: perPage  };
    if (searchQuery) {
      params.search = searchQuery;
    }
    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
    
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

updateProduct(id: number, formData: FormData): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // Important pour les fichiers
  });
}

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProduct(page: number, pageSize: number, searchQuery?: string): Observable<PaginatedResponse<Product>> {
    const params: any = { page, per_page: pageSize };
    if (searchQuery) {
      params.search = searchQuery;
    }
    return this.http.get<PaginatedResponse<Product>>('api/admin/products', { params });
  }
  
}