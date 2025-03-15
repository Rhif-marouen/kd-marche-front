// dashboard.component.ts
import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, DashboardStats } from '../../../core/services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Tableau de bord Admin</h2>
      
      <div class="row mt-4">
        <!-- Utilisateurs -->
        <div class="col-md-3">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Utilisateurs</h5>
              <p class="card-text">{{ stats().users }}</p>
            </div>
          </div>
        </div>

        <!-- Produits -->
        <div class="col-md-3">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Produits</h5>
              <p class="card-text">{{ stats().products }}</p>
            </div>
          </div>
        </div>

        <!-- Commandes -->
        <div class="col-md-3">
          <div class="card text-white bg-info mb-3">
            <div class="card-body">
              <h5 class="card-title">Commandes</h5>
              <p class="card-text">{{ stats().orders }}</p>
            </div>
          </div>
        </div>

        <!-- Revenus -->
        <div class="col-md-3">
          <div class="card text-white bg-warning mb-3">
            <div class="card-body">
              <h5 class="card-title">Revenus</h5>
              <p class="card-text">{{ stats().revenue | currency:'EUR' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats: Signal<DashboardStats> = this.adminService.stats;

  constructor(private adminService: AdminService) {}
}