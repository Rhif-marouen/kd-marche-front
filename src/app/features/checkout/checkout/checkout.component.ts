import { Component, OnInit, OnDestroy } from '@angular/core';
import { StripeService } from '../../../core/services/stripe.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { StripeElements, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SubscriptionResponse } from '../../../core/services/subscription-response.interface';

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
export class CheckoutComponent implements OnInit, OnDestroy {
  userEmail!: string;
  userId!: number;
  private stripe: Stripe | null = null;
  private cardElement!: StripeCardElement;
  isLoading = false;
  errorMessage = '';
  success = false;
  private elements!: StripeElements;

  // Style personnalisé pour Stripe Elements
  private cardStyle = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

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
      
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card', {
        style: this.cardStyle,
        hidePostalCode: true
      });
      
      this.cardElement.mount('#card-element');
      
      // Écoute les changements de validation
      this.cardElement.on('change', (event) => {
        this.errorMessage = event.error?.message || '';
      });

    } catch (error) {
      console.error('Erreur Stripe:', error);
      this.errorMessage = 'Erreur lors de l\'initialisation du système de paiement';
    }
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.unmount();
    }
  }

  async handleSubscription() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
  
    try {
      // Vérification explicite de Stripe
      if (!this.stripe) {
        throw new Error('Stripe non initialisé');
      }
  
      // Vérification de cardElement
      if (!this.cardElement) {
        throw new Error('Élément de carte non initialisé');
      }
  
      // Récupérer le payment_method
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement, 
      });
  
      if (error || !paymentMethod) throw error;
  
      // Appel API
      const response = await firstValueFrom(
        this.subscriptionService.createSubscription(
          paymentMethod.id, 
          this.userId
        )
      );
  
      // Confirmation du paiement
      if (response.client_secret) {
        const { error: confirmError } = await this.stripe.confirmCardPayment(
          response.client_secret
        );
        if (confirmError) throw confirmError;
      }
      

      // Redirection
      setTimeout(() => this.router.navigate(['/profile']), 3000);
     
      this.authService.refreshUserProfile();
    } catch (err: any) {
      this.errorMessage = this.handleError(err);
      console.error('Erreur:', err);
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(error: any): string {
    switch (error.code || error.type) {
      case 'card_declined':
        return 'Carte refusée - Veuillez essayer un autre moyen de paiement';
      case 'expired_card':
        return 'Carte expirée';
      case 'authentication_required':
        return 'Authentification 3D Secure requise - Vérifiez votre application bancaire';
      case 'validation_error':
        return 'Informations de carte invalides';
      default:
        return error.message || 'Erreur lors du traitement du paiement';
    }
  }
}