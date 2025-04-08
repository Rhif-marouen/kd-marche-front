// product-list.component.ts
import { Component, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe'; // Chemin corrigé
import { PublicProduct, PaginatedResponse } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule,
    TruncatePipe // Ajout du pipe dans les imports
  ],
  template: `
    <div class="product-grid">
      <mat-card *ngFor="let product of products()" class="product-card">
      <div class="image-container">
    <img 
      [src]="getImageUrl(product.image_url)" 
      alt="{{ product.name }}"
      (error)="handleImageError($event)"
    >
  </div>
        <mat-card-header>
          <mat-card-title>{{ product.name }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description">{{ product.description | truncate: 100 }}</p>
          <div class="product-footer">
            <span class="price">{{ product.price | currency:'EUR' }}</span>
            <span class="quality" [ngClass]="'quality-' + (product.quality || '')">
              Qualité {{ product.quality }}
            </span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-paginator
      [length]="totalItems()"
      [pageSize]="pageSize"
      [pageIndex]="currentPage() - 1"
      (page)="onPageChange($event)"
    ></mat-paginator>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    
    img {
        width: 100%;
        height: 90%;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05); // Effet zoom léger au survol
        }
      }


    .product-card {
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      height: 200px;
      width: 100px;
      object-fit: cover;
    }

    .description {
      height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .price {
      font-weight: bold;
      color: #2a9d8f;
    }

    .quality {
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .quality-a { background-color: #e9f5db; color: #2a9d8f; }
    .quality-b { background-color: #fefae0; color: #d4a373; }
    .quality-c { background-color: #f8edeb; color: #d62828; }
  `]
})

export class ProductListComponent {
  products = signal<PublicProduct[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = 12; // Correspond à per_page dans l'API

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getPublicProducts(this.currentPage()).subscribe({
      next: (response: PaginatedResponse<PublicProduct>) => {
        this.products.set(response.data);
        this.totalItems.set(response.meta.total);
      },
      error: (err) => console.error('Erreur de chargement:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.loadProducts();
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    return `${environment.storageUrl}/${imagePath}`;
  }
    
  

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('placeholder')) {
      img.src = 'assets/images/error-placeholder.png';
      img.classList.add('broken-image');
    }
  }
}