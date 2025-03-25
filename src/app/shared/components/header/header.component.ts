// header.component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

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
      <span>KD-Marché</span>
      
      <div class="nav-links">
        <a mat-button routerLink="/products">Produits</a>
        
        <ng-container *ngIf="authService.isLoggedIn()">
          <a *ngIf="!authService.isAdmin()" mat-button routerLink="/profile">Profil</a>
          <a *ngIf="authService.isAdmin()" mat-button routerLink="/admin/dashboard">
            <mat-icon>admin_panel_settings</mat-icon>
            Administration
          </a>
        </ng-container>
      </div>

      <div class="auth-section">
        <ng-container *ngIf="authService.isLoggedIn(); else notLoggedIn">
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </ng-container>

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
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

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