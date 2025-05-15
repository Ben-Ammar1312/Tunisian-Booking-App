// src/app/payment-dialog/payment-dialog.component.ts
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { StripeService } from '../Services/stripe.service';
import {CommonModule} from '@angular/common';

@Component({
  selector   : 'app-payment-dialog',
  standalone : true,
  imports: [CommonModule, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title>Paiement – {{data.amountTnd}} TND</h2>
    <mat-dialog-content class="pb-0">
      <div #host></div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="mt-3">
      <button mat-stroked-button (click)="dialog.close()">Annuler</button>
      <button mat-raised-button color="primary"
              (click)="pay()" [disabled]="busy">
        {{ busy ? 'Paiement…' : 'Payer' }}
      </button>
    </mat-dialog-actions>
  `
})
export class PaymentDialogComponent implements OnInit {

  @ViewChild('host', { static: true }) hostEl!: ElementRef<HTMLElement>;
  busy = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      propertyId: number; clientId: number; nights: number; amountTnd: number;
    },
    private stripe: StripeService,
    public  dialog:  MatDialogRef<PaymentDialogComponent>
  ) {}

  async ngOnInit() {
    const elem = await this.stripe.createPaymentElement(this.data);
    elem.mount(this.hostEl.nativeElement);
  }

  async pay() {
    this.busy = true;
    const { error } = await this.stripe.confirm();
    this.busy = false;

    if (error) {           // display Stripe’s own error message
      alert(error.message);
    } else {
      /* confirm() redirects on success – dialog can simply close */
      this.dialog.close();
    }
  }
}
