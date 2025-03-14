import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput formControlName="name" placeholder="Nom complet">
      </mat-form-field>

      <mat-form-field>
        <input matInput formControlName="email" type="email" placeholder="Email">
      </mat-form-field>

      <mat-form-field>
        <input matInput formControlName="password" type="password" placeholder="Mot de passe">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit">S'inscrire</button>
    </form>
  `
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.registerForm.invalid) return;
  
    this.authService.register(
      this.registerForm.getRawValue() // Retourne un objet complet avec les valeurs
    ).subscribe();
  }
}