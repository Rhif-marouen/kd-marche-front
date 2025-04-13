import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../core/models/cartItem.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems(); // Appel réel à la méthode ici
  }

  updateQuantity(item: any): void {
    this.cartService.updateItemQuantity(item.id, item.quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
    this.cartItems = this.cartService.getCartItems(); // rafraîchir le panier
  }

  proceedToCheckout(): void {
    if (this.cartService.getCartItems().length > 0) {
      this.router.navigate(['/checkout-form']); // Redirection vers le formulaire
    } else {
      alert('Votre panier est vide !');
    }
  }
}
