import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  template: `
    <table mat-table [dataSource]="users()">
      <!-- Colonne Nom -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nom</th>
        <td mat-cell *matCellDef="let user">{{ user.name }}</td>
      </ng-container>

      <!-- Colonne Actions -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user">
          <button mat-icon-button>
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['name', 'email', 'actions']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name', 'email', 'actions']"></tr>
    </table>
  `
})
export class UsersListComponent {
  users = signal<any[]>([]);
  
  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }
}