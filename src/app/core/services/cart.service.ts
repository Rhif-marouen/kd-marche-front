// cart.service.ts
import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cartItem.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  constructor(private snackBar: MatSnackBar) {}
 
  addItem(item: CartItem): void {
    console.log('addItem called with', item);
    const existingItem = this.cartItems().find(i => i.id === item.id);
    
    if(existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.update(items => [...items, item]);
    }
    this.snackBar.open('Produit ajouté au panier avec succès !', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  getCartItems() {
    return this.cartItems();
  }

  removeItem(id: number): void {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }
  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }  
  
  updateItemQuantity(productId: number, quantity: number): void {
    const updatedItems = this.cartItems()
      .map(item => {
        if (item.id === productId) {
          return { ...item, quantity }; // on retourne une nouvelle version de l'objet
        }
        return item;
      });
  
    this.cartItems.set(updatedItems); // mise à jour du signal
  }
  

  clearCart(): void {
    this.cartItems.set([]);
  }
}