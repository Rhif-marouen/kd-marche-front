// auth.service.ts
import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private currentUser = signal<any | null>(null);
  public user = this.currentUser.asReadonly();

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

  // auth.service.ts
login(credentials: { email: string; password: string }): Observable<{ is_admin: boolean }> {
  return this.http.post<{ token: string, is_admin: boolean }>(
    `${environment.apiUrl}/auth/login`,
    credentials,
    { headers: environment.defaultHeaders }
  ).pipe(
    tap(response => {
      localStorage.setItem(this.tokenKey, response.token);
      this.currentUser.set({ is_admin: response.is_admin }); // Mise à jour immédiate
    }),
    map(response => ({ is_admin: response.is_admin })), // Transformation
    catchError(error => this.handleError(error, 'Échec de la connexion'))
  );
}
  
  private fetchUserProfile(): Observable<void> {
    return this.http.get<any>(`${environment.apiUrl}/user`).pipe(
      tap(user => this.currentUser.set(user)),
      map(() => {}), // Conversion en Observable<void>
      catchError(error => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }
  // auth.service.ts
register(userData: { name: string; email: string; password: string }): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${environment.apiUrl}/auth/register`, // Utiliser le bon endpoint
    userData,
    { headers: environment.defaultHeaders }
  ).pipe(
    tap(response => {
      localStorage.setItem(this.tokenKey, response.token);
      this.fetchUserProfile().subscribe();
    }),
    catchError(error => {
      this.snackBar.open("Erreur d'inscription", 'Fermer', { duration: 3000 });
      return throwError(() => error);
    })
  );
}
  



  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/logout`, // <-- Ajouter /auth/
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
}