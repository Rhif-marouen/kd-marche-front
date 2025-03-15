import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput formControlName="name" placeholder="Nom complet">
        <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
          Le nom est obligatoire
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <input matInput formControlName="email" type="email" placeholder="Email">
        <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
          L'email est obligatoire
        </mat-error>
        <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
          Format d'email invalide
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <input matInput formControlName="password" type="password" placeholder="Mot de passe">
        <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
          Le mot de passe est obligatoire
        </mat-error>
        <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
          Minimum 8 caractères
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <input matInput formControlName="password_confirmation" 
               type="password" 
               placeholder="Confirmer le mot de passe">
        <mat-error *ngIf="registerForm.get('password_confirmation')?.hasError('required')">
          La confirmation est obligatoire
        </mat-error>
      </mat-form-field>

      <mat-error *ngIf="registerForm.hasError('mismatch')" class="error-message">
        Les mots de passe ne correspondent pas
      </mat-error>

      <button mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="registerForm.invalid || isLoading">
        S'inscrire
      </button>
    </form>
  `,
  styles: [`
    .error-message {
      color: #f44336;
      margin: -1rem 0 1rem 0;
      font-size: 0.875em;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin: 2rem auto;
    }
  `]
})
export class RegisterComponent {
  isLoading = false;
  registerForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    password_confirmation: this.fb.nonNullable.control('', Validators.required)
  }, { 
    validators: this.passwordMatchValidator 
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private passwordMatchValidator(g: AbstractControl) {
    const password = g.get('password')?.value;
    const confirm = g.get('password_confirmation')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 3000 });
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 422) {
          this.handleValidationErrors(error.error.errors);
        } else {
          this.snackBar.open('Erreur lors de l\'inscription', 'Fermer', { duration: 5000 });
        }
      }
    });
  }

  private handleValidationErrors(errors: { [key: string]: string[] }) {
    Object.keys(errors).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.setErrors({ serverError: errors[key][0] });
        control.markAsTouched();
      }
    });
  }
}