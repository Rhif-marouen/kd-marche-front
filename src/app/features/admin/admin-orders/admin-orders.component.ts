import { Component, OnInit } from '@angular/core';
import { Order, OrderService,PaginatedOrderResponse } from '../../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  // Déclaration explicite des propriétés
  orders: Order[] = [];
  isLoading: boolean = true;
  emailMessage: string = '';
  selectedOrder: Order | null = null;
  errorMessage: string | null = null;
  itemsPerPage: number = 10;
  isUpdating: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(page: number = 1) {
    this.isLoading = true;
    this.orderService.getAdminOrders(page, this.itemsPerPage).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.currentPage = res.current_page;
        this.totalPages = res.last_page;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = 'Erreur lors du chargement des commandes';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  updateStatus(orderId: number, newStatus: string) {
    this.isUpdating = true;
    if (newStatus === 'delivered') {
      if (confirm('Marquer comme livrée et envoyer un email de confirmation ?')) {
        this.orderService.updateDeliveryStatus(orderId, newStatus).subscribe({
          next: () => {
            this.loadOrders();
            alert('Statut mis à jour et email envoyé !');
          },
          error: (err) => alert('Erreur: ' + err.message)
        });
      }
    } else {
      // Logique existante pour les autres statuts
    }
   
  }

  getAddressPreview(address: any): string {
    if (!address) return 'Adresse non spécifiée';
    
    const parts = [
      address.street?.substring(0, 15),
      address.postal_code,
      address.city
    ].filter(Boolean);
  
    return parts.join(', ') + (parts.length < 3 ? '...' : '');
  }
  
  getFullAddress(address: any): string {
    if (!address) return '';
    return `${address.street}, ${address.postal_code} ${address.city}, ${address.country}`;
  }

  toggleOrderDetails(order: Order) {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }
}