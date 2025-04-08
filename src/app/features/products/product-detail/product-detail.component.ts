// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.productService.getProductDetails(+id).subscribe({
        next: (product) => this.product = product,
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  addToCart(): void {
    this.cartService.addItem({
      ...this.product,
      quantity: this.quantity
    });
  }
  incrementQuantity(): void {
    this.quantity++;
  }
  decrementQuantity(): void {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }
  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
  }
}