import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProductsService } from '../../../../core/services/admin-products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/models/category.model';
import { Product } from '../../../../core/models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

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
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup;
  selectedFile?: File;
  categories: Category[] = [];
  quality: string[] = ['A', 'B', 'C', 'D', 'E'];

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private productsService: AdminProductsService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
  ) {
    this.form = this.fb.group({
      name: [data.product?.name || '', Validators.required],
      price: [data.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      category_id: [data.product?.category_id || '', Validators.required],
      stock: [data.product?.stock || 0, [Validators.required, Validators.min(0)]],
      description: [data.product?.description || '', Validators.required],
      quality: [data.product?.quality || '', Validators.required],
      //image_url: [data.product?.image_url || '']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: (err: HttpErrorResponse) => 
        console.error('Erreur chargement catégories:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      if (!this.isValidFileType(file)) {
        alert('Seuls les JPG et PNG sont autorisés');
        this.clearFile();
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Taille maximale: 5MB');
        this.clearFile();
        return;
      }

      this.selectedFile = file;
    }
  }

  private isValidFileType(file: File): boolean {
    return ['image/jpeg', 'image/png','image/jpg'].includes(file.type);
  }

  clearFile(): void {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = undefined;
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = this.createFormData();
    
    if (!this.validateImageRequirement()) return;

    const request = this.data.product?.id 
      ? this.productsService.updateProduct(this.data.product.id, formData)
      : this.productsService.createProduct(formData);

    request.subscribe({
      next: (res: Product) => this.handleSuccess(res),
      error: (err: HttpErrorResponse) => this.handleError(err)
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.form.value;

    formData.append('name', formValue.name);
    formData.append('price', formValue.price.toString());
    formData.append('category_id', formValue.category_id);
    formData.append('stock', Math.floor(formValue.stock).toString());
    formData.append('description', formValue.description);
    formData.append('quality', formValue.quality);

    Object.keys(formValue).forEach(key => {
      if (key !== 'image_url') { // Exclure image_url
        formData.append(key, formValue[key]);
      }
    });
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Clé attendue par Laravel
    }

    return formData;
  }

  private validateImageRequirement(): boolean {
    if (!this.selectedFile && !this.data.product?.id) {
      alert('Image requise pour les nouveaux produits');
      return false;
    }
    return true;
  }

  private handleSuccess(res: Product): void {
    this.dialogRef.close({
      ...res,
      image_url: res.image_url || this.data.product?.image_url
    });
  }

  private handleError(err: HttpErrorResponse): void {
    console.error('Erreur:', err);
    const errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement';
    alert(`Erreur ${err.status}: ${errorMessage}`);
  }
}