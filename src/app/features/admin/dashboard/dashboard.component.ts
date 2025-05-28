// dashboard.component.ts
import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  imports: [CommonModule,MatIconModule,RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
    
})
export class DashboardComponent {
  stats: Signal<DashboardStats> = this.adminService.stats;

  constructor(private adminService: AdminService) {}
}