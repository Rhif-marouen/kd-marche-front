import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  createSubscription(paymentMethodId: string, userId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/subscription/create`, {
      payment_method: paymentMethodId,
      user_id: userId
    });
  }
}