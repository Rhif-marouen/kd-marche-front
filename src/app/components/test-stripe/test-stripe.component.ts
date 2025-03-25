import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../core/services/stripe.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-stripe',
  standalone: true,
  imports: [CommonModule], // <-- Ajout crucial pour ngClass
  template: `
    <div class="test-container">
      <h2>Test Stripe Integration</h2>
      
      <div id="card-element" class="card-element"></div>
      
      <button 
        mat-raised-button 
        color="primary" 
        (click)="handlePayment()"
        [disabled]="isProcessing"
      >
        {{ isProcessing ? 'Traitement...' : 'Tester le paiement ($9.99)' }}
      </button>
      
      <div class="status-message" [ngClass]="{ 'success': paymentSuccess, 'error': !paymentSuccess }">
        {{ paymentStatus }}
      </div>
    </div>
  `,
  styleUrls: ['./test-stripe.component.css']
})
export class TestStripeComponent implements OnInit {
  paymentStatus: string = '';
  paymentSuccess: boolean = false;
  isProcessing: boolean = false;
  private elements: any;

  constructor(
    private stripeService: StripeService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    await this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      const stripe = await this.stripeService.getStripe();
      if (!stripe) throw new Error('Stripe non initialisé');
      
      this.elements = stripe.elements();
      const card = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
          }
        }
      });
      card.mount('#card-element');
    } catch (error) {
      console.error('Erreur Stripe:', this.getErrorMessage(error));
    }
  }

  async handlePayment() {
    this.isProcessing = true;
    this.paymentStatus = 'Traitement du paiement...';

    try {
      const stripe = await this.stripeService.getStripe();
      if (!stripe || !this.elements) throw new Error('Stripe non initialisé');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: this.elements.getElement('card')
      });

      if (error) throw error;

      await firstValueFrom(
        this.http.post('/api/create-subscription', {
          paymentMethodId: paymentMethod.id,
          amount: 999,
          currency: 'usd'
        })
      );

      this.paymentSuccess = true;
      this.paymentStatus = 'Paiement réussi! ID: ' + paymentMethod.id;
    } catch (error) {
      this.paymentSuccess = false;
      this.paymentStatus = `Erreur: ${this.getErrorMessage(error)}`;
    } finally {
      this.isProcessing = false;
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erreur inconnue';
  }
}