import { Component, OnInit,Injectable } from '@angular/core';
import { StripeService } from '../../../core/services/stripe.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { StripeElements, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  userEmail!: string;
  userId!: number;
  private stripe: Stripe | null = null;
  private cardElement!: StripeCardElement;
  isLoading = false;
  errorMessage = '';
  success = false;

  constructor(
    private router: Router,
    private stripeService: StripeService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.userEmail = state['email'];
      this.userId = state['userId'];
    }
  }

  async ngOnInit() {
    try {
      this.stripe = await this.stripeService.getStripe();
      if (!this.stripe) throw new Error('Stripe non initialisé');
      
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a'
          }
        }
      });
      
      this.cardElement.mount('#card-element');
    } catch (error) {
      console.error('Erreur Stripe:', error);
      this.errorMessage = 'Erreur lors de l\'initialisation du système de paiement';
    }
  }

  async handleSubscription() {
    this.isLoading = true;
    this.errorMessage = '';
  
    try {
      if (!this.stripe || !this.cardElement) {
        throw new Error('Configuration de paiement invalide');
      }
  
      // ← Ici, on crée le PaymentMethod et on récupère son ID
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement
      });
  
      if (error) {
        // Si erreur de Stripe Elements, on l’affiche
        console.error(error);
        throw error;
      }
  
      console.log('ID du PaymentMethod:', paymentMethod.id);
  
      // ← On envoie l’ID du PaymentMethod à ton backend
      await firstValueFrom(
        this.subscriptionService.createSubscription(paymentMethod.id, this.userId)
      );
  
      // Paiement réussi
      this.success = true;
      this.authService.updateUserSubscriptionStatus(true);
  
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
  
    } catch (err: any) {
      this.errorMessage = this.handleError(err);
      console.error('Erreur de paiement:', err);
    } finally {
      this.isLoading = false;
    }
  }
  

  private handleError(error: any): string {
    if (error.code === 'card_declined') {
      return 'Carte refusée - Veuillez essayer un autre moyen de paiement';
    }
    if (error.type === 'validation_error') {
      return 'Information de carte invalide';
    }
    return error.message || 'Erreur lors du traitement du paiement';
  }

  
}