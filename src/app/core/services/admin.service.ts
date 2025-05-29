import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardStats, RevenueStats, OrderStats } from '../models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  
  stats = signal<DashboardStats>({
    orders: 0,
    users: 0,
    products: 0,
    revenue: 0
  });

  revenueStats = signal<RevenueStats>({ monthly: [], by_product: [] });
  orderStats = signal<OrderStats>({ by_status: [], trend: [] });

  constructor(private http: HttpClient) {
    this.loadStats();
  }

  loadStats() {
    this.http.get<DashboardStats>(`${this.apiUrl}/stats`).subscribe(data => {
      this.stats.set(data);
    });
  }

 getRevenueStats() {
  this.http.get<RevenueStats>(`${this.apiUrl}/revenue-stats`).subscribe({
    next: (data) => {
      console.log('Revenue Stats API Response:', data);
      this.revenueStats.set(data);
    },
    error: (err) => {
      console.error('Revenue Stats API Error:', err);
    }
  });
}

 /* getOrderStats() {
    this.http.get<OrderStats>(`${this.apiUrl}/order-stats`).subscribe(data => {
      this.orderStats.set(data);
    });
  } */
  getOrderStats() {
    this.http.get<OrderStats>(`${this.apiUrl}/order-stats`).subscribe({
      next: (data) => {
        console.log('Order Stats API Response:', data);
        this.orderStats.set(data);
      },
      error: (err) => {
        console.error('Order Stats API Error:', err);
      }
    });
  }
}