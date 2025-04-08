// cart.service.ts
import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  addItem(item: CartItem): void {
    const existingItem = this.cartItems().find(i => i.id === item.id);
    
    if(existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.update(items => [...items, item]);
    }
  }

  getCartItems() {
    return this.cartItems();
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}