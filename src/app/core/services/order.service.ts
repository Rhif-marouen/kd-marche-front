import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  // La propriété "items" doit correspondre à la structure renvoyée par le backend
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Passe une commande en envoyant les données (adresse et items) au backend.
   * @param orderData - Objet contenant l'adresse de livraison et la liste d'articles commandés.
   * @returns Observable<Order>
   */
  placeOrder(orderData: { address: string; items: OrderItem[] }): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Récupère la liste des commandes de l'utilisateur connecté.
   * @returns Observable<Order[]>
   */
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createOrder(orderData: any) {
    return this.http.post(`${environment.apiUrl}/orders`, orderData);
  }
  
  getAdminOrders() {
    return this.http.get(`${environment.apiUrl}/admin/orders`);
  }
}
