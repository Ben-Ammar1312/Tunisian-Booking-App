import { Component, Input, OnInit } from '@angular/core';
import { StripeService } from '../Services/stripe.service';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent implements OnInit {
  @Input() propId!: number;
  @Input() clientId!: number;
  @Input() nights!: number;
  @Input() pricePerNight!: number;

  cardEl!: any;
  loading = false;

  constructor(private stripeSvc: StripeService) {}

  async ngOnInit() {
    const amount = this.nights * this.pricePerNight;
    this.cardEl = await this.stripeSvc.initIntent({
      propertyId: this.propId,
      clientId:   this.clientId,
      nights:     this.nights,
      amountTnd:  amount
    });
    this.cardEl.mount('#card-element');
  }

  async pay() {
    this.loading = true;
    const { error } = await this.stripeSvc.confirm();
    this.loading = false;
    if (error) alert(error.message);
    // on success Stripe redirects, so no further code here
  }
}
