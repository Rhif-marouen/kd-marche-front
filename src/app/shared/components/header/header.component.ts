// header.component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
    <div class="logo-container">
    <img 
      src="/assets/images/logo.png" 
      alt="KD Marché Logo" 
      class="logo"
      routerLink="/"
    >
    <span>KD-Marché</span>
  </div>
      
      
      <div class="nav-links">
        <a mat-button routerLink="/products">Accueil</a>
        
        <ng-container *ngIf="authService.isLoggedIn()">
          <a *ngIf="!authService.isAdmin()" mat-button routerLink="/profile">Profil</a>
          <a *ngIf="authService.isAdmin()" mat-button routerLink="/admin/dashboard">
            <mat-icon>admin_panel_settings</mat-icon>
            Administration
          </a>
        </ng-container>
      </div>
      
      <div class="auth-section" >
        <ng-container *ngIf="authService.isLoggedIn(); else notLoggedIn">
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </ng-container>
        <button mat-button routerLink="/cart">
  <mat-icon>shopping_cart</mat-icon>
  Panier <span *ngIf="cartCount > 0">({{ cartCount }})</span>
</button>


        <ng-template #notLoggedIn>
          <a mat-button routerLink="/auth/login">Connexion</a>
          <a mat-button routerLink="/auth/register">S'inscrire</a>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
      margin-left: 2rem;
    }
    .auth-section {
      margin-left: auto;
      display: flex;
      gap: 1rem;
    }
    a[mat-button] {
      color: white;
    }
    mat-icon {
      margin-right: 0.5rem;
    }
    .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;

    .logo {
      height: 60px;
      width: auto;
      background-color: white;
      border-radius: 50%;
    }

    span {
      font-size: 1.5rem;
      font-weight: 500;
    }
  }
  @media (max-width: 768px) {
  .logo-container span {
    display: none;
  }
  
  .logo {
    height: 60px !important;
  }
}

  /* Déplacer la marge gauche sur le conteneur des liens */
  .nav-links {
    margin-left: 3rem;
  }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  cartService = inject(CartService);
  cartCount = this.cartService.getCartItems().length;

  logout() {
    this.authService.logout().subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutError()
    });
  }

  private handleLogoutSuccess() {
    this.router.navigate(['/auth/login']);
  }

  private handleLogoutError() {
    this.authService.clearAuthState();
    this.router.navigate(['/auth/login']);
  }
}