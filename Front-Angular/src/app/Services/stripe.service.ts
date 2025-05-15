// src/app/Services/stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe!: Stripe;
  private elements!: StripeElements;
  private clientSecret = '';

  /** create PaymentIntent + build <payment-element>  */
  async createPaymentElement(dto: {
    propertyId: number; nights: number; amountTnd: number;startIso: string, endIso:string
  }): Promise<StripePaymentElement> {

    const res = await firstValueFrom(
      this.http.post<any>(`${environment.apiUrl}/payments/create-intent`, dto)
    );

    this.clientSecret = res.clientSecret;

    this.stripe = (await loadStripe(res.publishableKey))!;
    this.elements = this.stripe.elements({ clientSecret: this.clientSecret });

    return this.elements.create('payment');
  }

  /** confirm when the user hits “Pay” */
  async confirm() {
    const { error } = await this.stripe.confirmPayment({
      /* `elements` already carries the clientSecret → no need to repeat it */
      elements     : this.elements,
      confirmParams: { return_url: window.location.origin + '/thank-you' },
      redirect     : 'if_required'      // ✅ tells Stripe to validate first,
    });

    return { error };                   // keep the existing signature
  }

  constructor(private http: HttpClient) {}
}
