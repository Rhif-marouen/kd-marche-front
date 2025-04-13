import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails: any;
  loading = true;

  constructor(
    public orderService: OrderService,
    public cartService: CartService
  ) {}
  downloadInvoice() {
    this.orderService.downloadInvoice().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${this.orderDetails.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur de téléchargement', err);
        alert('Impossible de télécharger la facture');
      }
    });
  }


  ngOnInit() {
    this.orderDetails = this.orderService.getLastOrder();
    
    if(!this.orderDetails) {
      this.orderService.getOrderFromApi().subscribe({
        next: (data) => {
          this.orderDetails = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      this.loading = false;
    }
    
  }
}