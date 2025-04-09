import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Order, OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders$: Observable<Order[]> | undefined;
  loading: boolean = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;
    this.orders$ = this.orderService.getUserOrders();
    // Optionnel : vous pouvez vous abonner pour gérer l'erreur et la fin de chargement
    this.orders$.subscribe({
      next: () => this.loading = false,
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement des commandes';
        this.loading = false;
      }
    });
  }
}
