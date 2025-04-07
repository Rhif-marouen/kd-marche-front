import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

})
export class ProfileComponent implements OnInit {
 // authService = inject(AuthService);
 products: Product[] = [];
 paginationMeta: any;
 errorMessage = '';

 constructor(
   public authService: AuthService,
   private productService: ProductService
 ) {}

// profile.component.ts
async ngOnInit() {
  if (this.authService.isAuthenticated() && this.authService.user()?.is_active) {
    try {
      const response$ = this.productService.getProducts();
      const response = await firstValueFrom(response$);
      this.products = response.data;
      this.paginationMeta = response.meta;
    } catch (error) {
      console.error('Erreur:', error);
    }
  }
}
async onPageChange(event: PageEvent): Promise<void> {
  const page = event.pageIndex + 1;
  try {
    const response = await firstValueFrom(
      this.productService.getProducts(page)
    );
    this.products = response.data;
    this.paginationMeta = response.meta;
  } catch (error) {
    console.error('Erreur de pagination:', error);
  }
}
}