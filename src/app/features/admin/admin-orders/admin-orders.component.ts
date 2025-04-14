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
  updatingOrders: { [key: number]: boolean } = {};
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
  updateStatus(orderId: number, newStatus: 'delivered' | 'canceled') {
    // Configuration des messages de confirmation
    const confirmationMessages = {
      delivered: 'Marquer comme livrée et envoyer un email de confirmation ?',
      canceled: 'Confirmer l\'annulation définitive de cette commande ?'
    };
  
    if (!confirm(confirmationMessages[newStatus])) {
      this.updatingOrders[orderId] = false;
      return;
    }
  
    this.updatingOrders[orderId] = true;
  
    this.orderService.updateDeliveryStatus(orderId, newStatus).subscribe({
      next: () => {
        this.loadOrders(); // Recharge les données actualisées
        this.updatingOrders[orderId] = false;
        
        const successMessages = {
          delivered: 'Statut mis à jour et email envoyé !',
          canceled: 'Commande annulée avec succès'
        };
        alert(successMessages[newStatus]);
      },
      error: (err) => {
        this.updatingOrders[orderId] = false;
        alert(`Erreur: ${err.error?.message || err.message}`);
        console.error('Détails de l\'erreur:', err);
      }
    });
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