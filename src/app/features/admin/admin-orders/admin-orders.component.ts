import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  emailMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getAdminOrders().subscribe({
      next: (res: any) => {
        this.orders = res.map((order: any) => ({
          ...order,
          created_at: new Date(order.created_at),
          is_overdue: this.checkOverdue(order)
        }));
        this.isLoading = false;
      },
      error: (err:Error) => {
        console.error(err);
        console.error('Erreur de chargement:', err.message);
        this.isLoading = false;
      }
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    this.orderService.updateDeliveryStatus(orderId, newStatus).subscribe({
      next: () => this.loadOrders(),
      error: (err) => alert('Erreur de mise à jour')
    });
  }

  sendEmail(order: any) {
    if (confirm('Envoyer un email au client ?')) {
      this.orderService.sendOrderEmail(order.id, this.emailMessage).subscribe({
        next: () => {
          alert('Email envoyé !');
          this.emailMessage = '';
        },
        error: (err) => console.error(err)
      });
    }
  }

  private checkOverdue(order: any): boolean {
    const hoursDiff = (Date.now() - new Date(order.created_at).getTime()) / 1000 / 60 / 60;
    return hoursDiff > 72 && order.delivery_status === 'pending';
  }
}