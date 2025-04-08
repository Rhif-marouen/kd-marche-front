import { Component } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [  CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems = this.cartService.getCartItems;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
