import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  createSubscription(paymentMethodId: string, userId: number) {
    return this.http.post(`${environment.apiUrl}/subscription/create`, {
      paymentMethodId,
      userId,
      amount: 9000, // 90€ en centimes
      currency: 'eur'
    });
  }
}