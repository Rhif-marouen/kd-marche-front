import { AfterViewInit, Component, ViewChild, Signal, signal } from '@angular/core';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product, PaginatedResponse } from '../../../core/models/product.model';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule],
  template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <!-- Nom -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nom</th>
        <td mat-cell *matCellDef="let product">{{ product.name }}</td>
      </ng-container>

      <!-- Prix -->
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Prix</th>
        <td mat-cell *matCellDef="let product">{{ product.price | currency }}</td>
      </ng-container>

      <!-- Stock -->
      <ng-container matColumnDef="stock">
        <th mat-header-cell *matHeaderCellDef>Stock</th>
        <td mat-cell *matCellDef="let product">{{ product.stock }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator [length]="totalItems()"
                   [pageSize]="pageSize"
                   [pageIndex]="currentPage() - 1"
                   (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styles: [`
    table { width: 100%; margin-top: 20px; }
    mat-paginator { margin-top: 20px; }
  `]
})
export class ProductsListComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Product>([]);
  totalItems = signal(0); // WritableSignal<number>
currentPage = signal(1);
  pageSize = 12;
  displayedColumns = ['name', 'price', 'stock'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminProductService: AdminProductsService) {}

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminProductService.getProducts(this.currentPage()).subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.dataSource.data = response.data;
        if (response.meta && response.meta.total !== undefined) {
          this.totalItems.set(response.meta.total);
        }
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.loadProducts();
  }
}
