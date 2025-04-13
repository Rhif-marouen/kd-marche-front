import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

// Définition des interfaces
export interface OrderItem {
  product_id: number;
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
  user: { name: string; email: string };
  total: number;
  status: string;
  delivery_status: string;
  created_at: Date;
  is_overdue: boolean;
  items: Array<{
    product: ProductDetails;
    quantity: number;
  }>;
}

// Interface pour la réponse API
interface ApiOrderResponse {
  id: number;
  user: { name: string; email: string };
  total: number;
  status: string;
  delivery_status: string;
  created_at: string; // Date en string depuis l'API
  items: Array<{
    product: ProductDetails;
    quantity: number;
  }>;
}
interface PaginatedApiResponse {
  data: ApiOrderResponse[];
  // ... autres propriétés de pagination
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
  
  getAdminOrders(): Observable<Order[]> {
    return this.http.get<PaginatedApiResponse>(this.apiUrl).pipe(
      map(response => response.data.map(apiOrder => ({
        ...apiOrder,
        created_at: new Date(apiOrder.created_at),
        is_overdue: this.checkOverdue(new Date(apiOrder.created_at), apiOrder.delivery_status)
      })))
    );
  }
  private transformOrder(apiOrder: ApiOrderResponse): Order {
    return {
      ...apiOrder,
      created_at: new Date(apiOrder.created_at),
      is_overdue: this.checkOverdue(new Date(apiOrder.created_at), apiOrder.delivery_status)
    };
  }

  updateDeliveryStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/${orderId}/delivery-status`,
      { delivery_status: status }
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
  
  getOrderFromApi() {
    return this.http.get(`${this.apiUrl}/orders/${this.lastOrder.value.id}`);
  }
  
  downloadInvoice() {
    return this.http.get(`${this.apiUrl}/orders/${this.lastOrder.value.id}/invoice`, 
      { responseType: 'blob' });
  }

}