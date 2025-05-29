import { Component, Signal, OnInit, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats, RevenueStats, OrderStats } from '../../../core/models/dashboard-stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: Signal<DashboardStats> = this.adminService.stats;
  revenueStats: Signal<RevenueStats> = this.adminService.revenueStats;
  orderStats: Signal<OrderStats> = this.adminService.orderStats;

  private revenueChart: Chart | null = null;
  private orderStatusChart: Chart | null = null;
  private orderTrendChart: Chart | null = null;

constructor(private adminService: AdminService) {
  Chart.register(...registerables);

  // Déplacer l'effect ici
  effect(() => {
    if (this.revenueStats().monthly.length > 0) {
      setTimeout(() => this.renderRevenueChart(), 100);
    }
    if (this.orderStats().by_status.length > 0) {
      setTimeout(() => this.renderOrderStatusChart(), 100);
    }
    if (this.orderStats().trend.length > 0) {
      setTimeout(() => this.renderOrderTrendChart(), 100);
    }
  });
}
  ngOnInit(): void {
    this.adminService.getRevenueStats();
    this.adminService.getOrderStats();
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }
  

  renderCharts() {
    console.log('Rendering charts...');
  
  // Vérifier les données de revenus
  const revenueData = this.revenueStats();
  console.log('Revenue Data:', revenueData);
  console.log('Monthly Revenue:', revenueData.monthly);
  
  // Vérifier les données de commandes
  const orderData = this.orderStats();
  console.log('Order Data:', orderData);
  console.log('Order by Status:', orderData.by_status);
  console.log('Order Trend:', orderData.trend);
    this.renderRevenueChart();
    this.renderOrderStatusChart();
    this.renderOrderTrendChart();
  }

  renderRevenueChart() {
    const data = this.revenueStats();
     // Vérifier si les données sont valides
  if (!data || !data.monthly || data.monthly.length === 0) {
    console.warn('No revenue data available for chart');
    return;
  }

    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    
    // Détruire le graphique existant
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const labels = data.monthly.map(item => `${item.month}/${item.year}`);
    const revenueData = data.monthly.map(item => item.total);

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenus mensuels (€)',
          data: revenueData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Revenus par mois' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

 renderOrderStatusChart() {
    const data = this.orderStats();
    if (data.by_status.length === 0) return;

    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    
    // Détruire le graphique existant
    if (this.orderStatusChart) {
        this.orderStatusChart.destroy();
    }

    // Traduction des statuts
    const statusLabels: { [key: string]: string } = {
        'delivered': 'Livrées',
        'overdue': 'En retard',
        'pending': 'En attente',
        'canceled': 'Annulées'
    };

    // Créer les données pour le graphique
    const labels = data.by_status.map(item => 
        `${statusLabels[item.status] || item.status} (${item.percentage}%)`
    );
    
    const counts = data.by_status.map(item => item.count);
    //const backgroundColors = data.by_status.map(item => item.color);
const customColors: { [key: string]: string } = {
  delivered: '#4caf50',
  overdue: '#f44336',
  pending: '#ff9800',
  canceled: '#9e9e9e'
};


const backgroundColors = data.by_status.map(item => customColors[item.status] || '#ccc');


    this.orderStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Statut de livraison des commandes',
                    font: { size: 16 }
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label.split(' (')[0]}: ${value} commandes`;
                        }
                    }
                }
            }
        }
    });
}
  renderOrderTrendChart() {
    const data = this.orderStats();
    if (data.trend.length === 0) return;

    const ctx = document.getElementById('orderTrendChart') as HTMLCanvasElement;
    
    // Détruire le graphique existant
    if (this.orderTrendChart) {
      this.orderTrendChart.destroy();
    }

    const labels = data.trend.map(item => new Date(item.date).toLocaleDateString());
    const trendData = data.trend.map(item => item.count);
    
    this.orderTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Commandes par jour',
          data: trendData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Évolution des commandes (30 jours)' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}