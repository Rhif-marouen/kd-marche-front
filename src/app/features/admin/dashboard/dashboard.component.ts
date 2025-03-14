// dashboard.component.ts
import { Component } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Tableau de bord Admin</h2>
      
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Utilisateurs</h5>
              <p class="card-text">{{ stats?.users || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Produits</h5>
              <p class="card-text">{{ stats?.products || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card text-white bg-info mb-3">
            <div class="card-body">
              <h5 class="card-title">Commandes</h5>
              <p class="card-text">{{ stats?.orders || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats: any;

  constructor(private adminService: AdminService) {
    this.adminService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });
  }
}