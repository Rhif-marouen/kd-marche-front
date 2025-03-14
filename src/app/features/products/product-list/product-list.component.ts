import { Component, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PublicProduct, PaginatedResponse } from '../../../core/models/product.model';


@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="products()">
      <!-- Colonne Nom -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nom</th>
        <td mat-cell *matCellDef="let product">{{ product.name }}</td>
      </ng-container>

      <!-- Colonne Description -->
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let product">{{ product.description }}</td>
      </ng-container>

      <!-- En-têtes et lignes -->
      <tr mat-header-row *matHeaderRowDef="['name', 'description']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name', 'description']"></tr>
    </table>

    <!-- Pagination -->
    <mat-paginator [length]="totalItems()"
                   [pageSize]="pageSize"
                   [pageIndex]="currentPage() - 1"
                   (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styles: [`
    table {
      width: 100%;
      margin-top: 20px;
    }
    mat-paginator {
      margin-top: 20px;
    }
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
}