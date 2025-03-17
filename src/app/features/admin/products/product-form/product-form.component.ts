import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductsService } from '../../../../core/services/admin-products.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
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

  constructor(
    private fb: FormBuilder,
    private productsService: AdminProductsService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: any }
  ) {
    this.form = this.fb.group({
      name: [data.product?.name || '', Validators.required],
      price: [data.product?.price || '', [Validators.required, Validators.min(0.01)]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('price', this.form.value.price);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    const request = this.data.product
      ? this.productsService.updateProduct(this.data.product.id, formData)
      : this.productsService.createProduct(formData);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => console.error('Erreur:', err)
    });
  }
}
