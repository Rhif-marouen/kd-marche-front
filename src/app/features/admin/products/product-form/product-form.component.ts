import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductsService } from '../../../../core/services/admin-products.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
  ],

  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Modifier' : 'Créer' }} un produit</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>

        <mat-form-field>
          <mat-label>Nom du produit</mat-label>
          <input matInput type="text" formControlName="name" placeholder="Nom du produit">
          <mat-error *ngIf="form.controls['name'].hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Prix</mat-label>
          <input matInput type="number" formControlName="price" placeholder="Prix">
          <mat-error *ngIf="form.controls['price'].hasError('required')">
            Le prix est requis
          </mat-error>
          <mat-error *ngIf="form.controls['price'].hasError('min')">
            Le prix doit être supérieur à 0
          </mat-error>
        </mat-form-field>
        <mat-form-field>
  <mat-label>Catégorie</mat-label>
  <mat-select formControlName="category_id">
    <mat-option *ngFor="let category of categories" [value]="category.id">
      {{ category.name }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="form.controls['category_id'].invalid">
    La catégorie est obligatoire
  </mat-error>
</mat-form-field>
        <mat-form-field>
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" placeholder="Stock">
          <mat-error *ngIf="form.controls['stock'].hasError('required')">
            Le stock est requis
          </mat-error>
          <mat-error *ngIf="form.controls['stock'].hasError('min')">
            Le stock doit être supérieur ou égal à 0
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Description</mat-label>
          <input matInput type="text" formControlName="description" placeholder=" description">
          <mat-error *ngIf="form.controls['description'].hasError('required')">
            La description est requise
          </mat-error>
        </mat-form-field>

        <mat-form-field>
  <mat-label>Qualité produit</mat-label>
  <mat-select formControlName="quality">
    <mat-option *ngFor="let q of quality" [value]="q">
      {{ q }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="form.controls['quality'].invalid">
    La qualité est obligatoire
  </mat-error>
</mat-form-field>

        

        <input type="file" (change)="onFileSelected($event)">
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="dialogRef.close()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.product ? 'Modifier' : 'Créer' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class ProductFormComponent {
  form: FormGroup;
  selectedFile?: File;
  categories: Category[] = [];
  quality: string[] = ['A', 'B', 'C', 'D', 'E'];

  constructor(

    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private productsService: AdminProductsService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: any }
  ) {
    console.log('Données du produit reçues:', data.product);
    this.form = this.fb.group({
      name: [this.data.product?.name || '', Validators.required],
      price: [this.data.product?.price || 0, [Validators.required, Validators.min(0.01)]], 
      category_id: [this.data.product?.category_id || '', Validators.required],
      stock: [this.data.product?.stock || 0, [Validators.required, Validators.min(0)]],
      description: [this.data.product?.description || '', Validators.required],
      quality: [this.data.product?.quality || '', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

// product-form.component.ts
submit(): void {
  if (this.form.invalid) return;

  const formData = new FormData();
  formData.append('name', this.form.value.name);
  formData.append('price', Number(this.form.value.price).toFixed(2)); // Conversion en nombre
  formData.append('category_id', String(this.form.value.category_id));
  formData.append('stock', String(Math.floor(this.form.value.stock)));
  formData.append('description', this.form.value.description);
  formData.append('quality', this.form.value.quality);

  if (this.selectedFile) {
    formData.append('image', this.selectedFile); // Retirer .name
  }

    const request = this.data.product
      ? this.productsService.updateProduct(this.data.product.id, formData)
      : this.productsService.createProduct(formData);

    request.subscribe({
      next: () => {
        this.dialogRef.close(true);
        alert('Opération réussie !');
      },
      error: (err) => {
        console.error('Détails erreur:', err);
        alert(`Erreur: ${err.error?.message || 'Une erreur est survenue'}`);
      }
    });
  }
  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        console.log('Catégories chargées:', this.categories); // Debug
      },
      error: (err) => {
        console.error('Erreur de chargement des catégories:', err);
        alert('Impossible de charger les catégories');
      }
    });
  }
}


