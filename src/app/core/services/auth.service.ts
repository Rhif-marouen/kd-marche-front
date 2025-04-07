
import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private currentUser = signal<User | null>(null);
  public user = () => this.currentUser();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token) {
      this.fetchUserProfile().subscribe({
        error: () => this.clearAuthState()
      });
    }
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials,
      { headers: environment.defaultHeaders }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUser.set(response.user);
      }),
      map(response => response.user),
      catchError(error => this.handleError(error, 'Échec de la connexion'))
    );
  }

  private fetchUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`).pipe(
      tap(user => this.currentUser.set(user)),
      catchError(error => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

 /* register(userData: { name: string; email: string; password: string }): Observable<string> {
    return this.http.post<{ user: User; token: string }>(
      `${environment.apiUrl}/auth/register`,
      userData,
      { headers: environment.defaultHeaders }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUser.set(response.user); // Utilisez l'utilisateur de la réponse
      }),
      map(response => response.token),
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        this.snackBar.open("Erreur d'inscription: " + error.error.message, 'Fermer', { duration: 5000 });
        return throwError(() => error);
      })
    );
  } */

    // Mettre à jour la méthode register
register(userData: { name: string; email: string; password: string }): Observable<{ user: User; token: string }> {
  return this.http.post<{ user: User; token: string }>(
    `${environment.apiUrl}/auth/register`,
    userData,
    { headers: environment.defaultHeaders }
  ).pipe(
    tap(response => {
      localStorage.setItem(this.tokenKey, response.token);
      this.currentUser.set(response.user);
    }),
    catchError(error => {
      console.error('Erreur d\'inscription:', error);
      this.snackBar.open("Erreur d'inscription: " + error.error.message, 'Fermer', { duration: 5000 });
      return throwError(() => error);
    })
  );
}

  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/logout`, 
      {},
      { 
        headers: this.getAuthHeaders(),
        withCredentials: true 
      }
    ).pipe(
      tap(() => this.clearAuthState()),
      catchError(error => this.handleError(error, 'Erreur de déconnexion'))
    );
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Accept': 'application/json'
    });
  }

  public clearAuthState(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.is_admin === true;
  }

  private handleError(error: any, message: string): Observable<never> {
    this.snackBar.open(message, 'Fermer', { duration: 5000 });
    return throwError(() => error);
  }

  updateUserSubscriptionStatus(isActive: boolean) {
    const currentUser = this.currentUser();
    if (currentUser) {
      this.currentUser.set({ ...currentUser, is_active: isActive });
    }
  }
  isAuthenticated(): boolean {
    return !!this.user; // Adaptez à votre logique d'authentification
  }

}