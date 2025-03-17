// header.component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true, // <-- Ajouter cette ligne
  imports: [CommonModule, RouterLink,MatIconModule], // <-- Importer les dépendances
  selector: 'app-header',
  template: `
    <nav>
  
      <a routerLink="/products">Produits</a>
      <div *ngIf="authService.isLoggedIn()">
        <a routerLink="/profile" *ngIf="!authService.isAdmin()">Profil</a>
        <a *ngIf="authService.isAdmin()" routerLink="/admin/dashboard">
      <mat-icon>admin_panel_settings</mat-icon>
      Administration
    </a>
        <button (click)="logout()">Déconnexion</button>
      </div>
      <div *ngIf="!authService.isLoggedIn()">
        <a routerLink="/auth/login">Connexion</a>
        <a routerLink="/auth/register">S'inscrire</a>
      </div>
    </nav>
  `,
  styles: [`
    nav { padding: 1rem; display: flex; gap: 1rem; }
    a { text-decoration: none; color: #333; }
    button { margin-left: auto; }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        this.router.navigate(['/auth/login']);
        this.authService.clearAuthState(); // Forçage de la déconnexion locale
      }
    });
  }
}