// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(this.apiUrl).pipe(
      map(response => response.data) // Extraction du tableau data
    );
  }

  searchByEmail(email: string): Observable<User[]> {
    return this.http.get<{ data: User[] }>(this.apiUrl, {
      params: { email } // Envoie le paramètre 'email' correctement
    }).pipe(
      map(response => response.data) // Extrait le tableau data
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData); // <-- Ajouter slash
  }

// Correction dans user.service.ts
toggleAdminStatus(user: User): Observable<User> {
  return this.http.patch<User>(
      `${this.apiUrl}/${user.id}/toggle-admin`,
    { is_admin: !user.is_admin }, // Corps de la requête
    { // Options séparées
      headers: {
        'Content-Type': 'application/json', // Ajouter ce header
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }
  );
}
} 