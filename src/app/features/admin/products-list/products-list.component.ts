import { AfterViewInit, Component, ViewChild, signal } from '@angular/core';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product } from '../../../core/models/product.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductFormComponent } from '../products/product-form/product-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule

  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements AfterViewInit {
  displayedColumns = ['name', 'category', 'price', 'stock', 'qualité', 'description', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  totalItems = signal(0);
  currentPage = signal(0);
  pageSize = signal(12);
  searchQuery = signal('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminProductService: AdminProductsService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminProductService.getProducts(
      this.currentPage() + 1,
      this.pageSize(),
      this.searchQuery()
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems.set(response.meta.total);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Modifier la méthode d'ouverture du formulaire
  openProductForm(productId?: number): void {
    if (productId) {
      this.adminProductService.getProductById(productId).subscribe({
        next: (product) => {
          const dialogRef = this.dialog.open(ProductFormComponent, {
            width: '600px',
            data: { product }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadProducts();
          });
        },
        error: (err) => console.error('Erreur:', err)
      });
    } else {
      const dialogRef = this.dialog.open(ProductFormComponent, {
        width: '600px',
        data: { product: null }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadProducts();
      });
    }
  }
  handleSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(0);
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  editProduct(productId: number): void {
    this.adminProductService.getProductById(productId).subscribe({
      next: (product) => {
        console.log('Produit récupéré:', product);
        const dialogRef = this.dialog.open(ProductFormComponent, {
          width: '600px',
          data: { product } // Envoyer les données complètes
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) this.loadProducts();
        });
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.adminProductService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}