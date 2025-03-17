import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private stats$ = this.http.get<DashboardStats>(`${environment.apiUrl}/admin/stats`, {
    headers: {
      Authorization: `Bearer ${this.authService.getToken()}`
    }
  });

  stats = toSignal(this.stats$, {
    initialValue: {
      users: 0,
      products: 0,
      orders: 0,
      revenue: 0
    }
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService,
   
  ) {}
}

export { DashboardStats };
