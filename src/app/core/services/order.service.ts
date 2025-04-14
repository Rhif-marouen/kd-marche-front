import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, map,throwError } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';

// Définition des interfaces
export interface OrderItem {
  product: ProductDetails;
  quantity: number;
  price: number;

}

export interface ProductDetails {
  product_id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  user: { name: string; email: string };
  total: number;
  status: string;
  delivery_status: string;
  created_at: Date;
  updated_at: Date;
  address: {         // Ajouté
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  phone: string;
  is_overdue: boolean;
  stripe_payment_id?: string;
  items: Array<{
    product: ProductDetails;
    quantity: number;
  }>;
}

// Interface pour la réponse API
interface ApiOrderResponse {
  id: number;
  user_id: number;
  user: { name: string; email: string };
  total: number;
  status: string;
  delivery_status: string;
  created_at: string;
  updated_at: string; 
  address: { // Ajouter ces champs
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  phone: string; // Ajouter
  items: Array<{
    product: ProductDetails;
    quantity: number;
  }>;
  stripe_payment_id?: string;
}
export interface PaginatedOrderResponse {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface PaginatedApiResponse {
  data: ApiOrderResponse[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/admin/orders`;
  private tempOrderData: any;
  private lastOrder = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  placeOrder(orderData: { address: string; items: OrderItem[] }): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/orders`, orderData);
  }
  
  getAdminOrders(page: number = 1, perPage: number = 20): Observable<PaginatedOrderResponse> {
    return this.http.get<PaginatedApiResponse>(`${this.apiUrl}?page=${page}&per_page=${perPage}`)
      .pipe(
        tap(response => console.log('Réponse API:', response)), // Pour vérifier le format
        map(response => ({
          data: response.data.map(apiOrder => this.transformOrder(apiOrder)),
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          links: response.links
        })),
        catchError(err => {
          console.error("Erreur chargement commandes", err);
          return throwError(err);
        })
      );
  }
  
  private transformOrder(apiOrder: ApiOrderResponse): Order {
    return {
      id: apiOrder.id,
      user_id: apiOrder.user_id,
      user: apiOrder.user,
      total: apiOrder.total,
      status: apiOrder.status,
      delivery_status: apiOrder.delivery_status,
      created_at: new Date(apiOrder.created_at),
      updated_at: new Date(apiOrder.updated_at),
      address: apiOrder.address,
      phone: apiOrder.phone,
      items: apiOrder.items.map(item => ({
        product: {
          product_id: item.product.product_id,
          name: item.product.name,
          price: item.product.price
        },
        quantity: item.quantity
      })),
      is_overdue: this.checkOverdue(new Date(apiOrder.created_at), apiOrder.delivery_status)
    };
  }

// order.service.ts
updateDeliveryStatus(orderId: number, status: string): Observable<Order> {
  return this.http.put<Order>(
    `${this.apiUrl}/${orderId}/delivery-status`,
    { delivery_status: status }, // Le nom doit correspondre exactement à ce qu'attend l'API
    {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    }
  );
}
  private checkOverdue(createdAt: Date, deliveryStatus: string): boolean {
    const hoursDiff = (Date.now() - createdAt.getTime()) / 1000 / 60 / 60;
    return hoursDiff > 72 && deliveryStatus === 'pending';
  }
  sendOrderEmail(orderId: number, message: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/orders/${orderId}/send-email`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }
  setTempOrderData(data: any): void {
    this.tempOrderData = data;
  }
  
  getTempOrderData(): any {
    return this.tempOrderData;
  }
  setLastOrder(order: any) {
    this.lastOrder.next(order);
  }
  
  getLastOrder() {
    return this.lastOrder.value;
  }
  getOrderFromApi(): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${this.lastOrder.value.id}`);
  }
  downloadInvoice() {
    return this.http.get(`${this.apiUrl}/orders/${this.lastOrder.value.id}/invoice`, 
      { responseType: 'blob' });
  }

}