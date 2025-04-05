import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey, {
      locale: 'fr' // Définit la langue française pour Stripe
    });
  }

  async getStripe(): Promise<Stripe | null> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être initialisé');
    }
    return this.stripePromise;
  }
}