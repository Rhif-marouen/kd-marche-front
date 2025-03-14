import { Component, inject, Signal, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedResponse, ProductService } from '../../../core/services/product.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { Product, PublicProduct } from '../../../core/models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    CurrencyPipe
  ],
  template: `
    <div class="container">
      <!-- Loading state -->
      <mat-progress-bar 
        *ngIf="isLoading()" 
        mode="indeterminate">
      </mat-progress-bar>

      <!-- Error state -->
      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <!-- Data display -->
      <table *ngIf="!isLoading() && !error()" mat-table [dataSource]="products()">
        <!-- Colonne Nom -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nom</th>
          <td mat-cell *matCellDef="let product">{{ product.name }}</td>
        </ng-container>

        <!-- Colonne Prix (admin seulement) -->
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Prix</th>
          <td mat-cell *matCellDef="let product">
            {{ product.price | currency:'EUR' }}
          </td>
        </ng-container>

        <!-- Colonne Catégorie -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Catégorie</th>
          <td mat-cell *matCellDef="let product">{{ product.category }}</td>
        </ng-container>

        <!-- Colonne Stock -->
        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let product">
            <span [class]="stockStatusClass(product.stock)">
              {{ product.stock }}
            </span>
          </td>
        </ng-container>

        <!-- Colonne Actions (admin seulement) -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let product">
            <button mat-icon-button color="primary">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    </div>
  `,
  // ... (styles restent identiques)
})
export class ProductsListComponent {
  products = signal<(Product | PublicProduct)[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isAdmin = inject(AuthService).isAdmin();

  displayedColumns = computed<string[]>(() => {
    const base = ['name', 'category', 'stock'];
    return this.isAdmin ? [...base, 'price', 'actions'] : base;
  });

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

private loadProducts(): void {
  this.isLoading.set(true);
  this.error.set(null);

  if (this.isAdmin) {
    this.productService.getAdminProducts().subscribe({
      next: (res: PaginatedResponse<Product>) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, 'Erreur admin');
      }
    });
  } else {
    this.productService.getPublicProducts().subscribe({
      next: (res: PublicProduct[]) => {
        this.products.set(res);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, 'Erreur public');
      }
    });
  }
}

private handleError(err: HttpErrorResponse, defaultMsg: string): void {
  this.error.set(err.error?.message || defaultMsg);
  this.isLoading.set(false);
  console.error('Erreur API:', err);
}

  stockStatusClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'low-stock';
    return '';
  }
}