import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { StripeService } from '../../../core/services/stripe.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-checkout-order',
  standalone: true,
  imports: [   CommonModule,],
  templateUrl: './checkout-order.component.html',
  styleUrl: './checkout-order.component.scss'
})
export class CheckoutOrderComponent implements OnInit {
  stripe: any;
  cardElement: any;
  isLoading = false;
  errorMessage = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private stripeService: StripeService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.stripe = await this.stripeService.getStripe();
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element-order');
  }

  async handlePayment() {
    this.isLoading = true;
    const orderData = this.orderService.getTempOrderData();
  
    if (!orderData) {
      this.router.navigate(['/checkout-form']);
      return;
    }
  
    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement
      });
  
      if (error) throw error;
  
      const response = await firstValueFrom(
        this.orderService.createOrder({
          ...orderData,
          paymentMethodId: paymentMethod.id,
          items: this.cartService.getCartItems()
        })
      );
      this.orderService.setLastOrder(response); 
  
      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation']);
      
    } catch (err: any) {
      this.errorMessage = err.message || 'Erreur de paiement';
    } finally {
      this.isLoading = false;
    }
  }
}