import { Component, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Product } from '../../../core/models/product.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CurrencyPipe,
    DatePipe,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="container">
      <mat-progress-bar 
        *ngIf="isLoading()" 
        mode="indeterminate">
      </mat-progress-bar>

      <div *ngIf="error()" class="error">
        {{ error() }}
      </div>

      <mat-card *ngIf="product() && !isLoading()">
        <mat-card-header>
          <mat-card-title>{{ product()?.name }}</mat-card-title>
          <mat-card-subtitle>
            Catégorie : {{ product()?.category }}
          </mat-card-subtitle>
        </mat-card-header>

        <img 
          *ngIf="product()?.image_url"
          mat-card-image 
          [src]="product()?.image_url" 
          [alt]="product()?.name">

        <mat-card-content>
          <p>{{ product()?.description }}</p>
          
          <div class="details-grid">
            <div>
              <span class="label">Prix :</span>
              <span>{{ product()?.price | currency:'EUR' }}</span>
            </div>
            <div>
              <span class="label">Stock :</span>
              <span [class]="stockStatusClass(product()?.stock ?? 0)">
  {{ product()?.stock }}
</span>

            </div>
            <div>
              <span class="label">Dernière mise à jour :</span>
              <span>{{ product()?.updated_at | date:'medium' }}</span>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary"
            routerLink="/products">
            Retour à la liste
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .error {
      color: #d32f2f;
      padding: 20px;
      background-color: #ffebee;
      border-radius: 4px;
      margin: 20px 0;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }
    .label {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
    }
    .low-stock {
      color: #f57c00;
    }
    .out-of-stock {
      color: #d32f2f;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }
  `]
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.productService.getProduct(+id).subscribe({
        next: (product) => {
          this.product.set(product);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Impossible de charger les détails du produit');
          this.isLoading.set(false);
          console.error(err);
        }
      });
    } else {
      this.error.set('ID produit invalide');
      this.isLoading.set(false);
    }
  }
  stockStatusClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'low-stock';
    return '';
  }
  
}