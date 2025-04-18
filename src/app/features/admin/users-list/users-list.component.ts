// admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ], // Add necessary Angular modules here
  selector: 'app-admin-users',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  searchEmail = '';
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users; // Reçoit directement le tableau
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchEmail) {
      this.loadUsers();
      return;
    }

    this.isLoading = true;
    this.userService.searchByEmail(this.searchEmail).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  toggleAdmin(user: User): void {
    if (!confirm(`Confirmer le changement de statut admin pour ${user.email} ?`)) return;
    
    this.userService.toggleAdminStatus(user).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => alert('Erreur: ' + err.message)
    });
  }

  filterUsers() {
    return this.users.map(user => ({
      ...user,
      // Correction du champ stripe_id venant de l'API
      stripe_id: user.stripe_id || null,
      // Masquage des infos d'abonnement pour les admins
      is_active: user.is_admin ? false : user.is_active
    }));
  }
}