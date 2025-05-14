import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { loadStripe, Stripe, StripeElements ,  StripePaymentElement} from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe!: Stripe;
  private elements!: StripeElements;
  clientSecret!: string;

  constructor(private http: HttpClient) {}

  /** Step 1: ask backend to create PaymentIntent */
  async initIntent(dto: {
    propertyId: number;
    clientId:   number;
    nights:     number;
    amountTnd:  number;
  }) {
    const res = await firstValueFrom(
      this.http.post<any>(`${environment.apiUrl}/api/payments/create-intent`, dto)
    );

    this.clientSecret = res.clientSecret;
    const stripe = await loadStripe(res.publishableKey);
    if (!stripe) throw new Error('Stripe.js failed to load');   // guard-clause
    this.stripe = stripe;
    this.elements = this.stripe!.elements({ clientSecret: this.clientSecret });
    return this.elements.create('payment');          // return element instance
  }

  /** Step 2: confirm payment when user clicks “Pay” */
  async confirm() {
    return await this.stripe.confirmPayment({
      elements: this.elements,
      clientSecret: this.clientSecret,
      confirmParams: {
        return_url: window.location.origin + '/thank-you'
      }
    });
  }
}
