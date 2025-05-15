import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { HttpClient }           from '@angular/common/http';

import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
/* ─────  Material date-picker  ───── */
import {
  MatDateRangeInput,
  MatDatepickerInputEvent,
  DateRange,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatNativeDateModule }  from '@angular/material/core';

import { differenceInCalendarDays } from 'date-fns';

import { environment }   from '../../environments/environments';
import { StripeService } from '../Services/stripe.service';
import {StripePaymentElement} from '@stripe/stripe-js';
import {PaymentDialogComponent} from '../payment-dialog/payment-dialog.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector   : 'app-property-details',
  standalone : true,
  templateUrl: './property-details.component.html',
  styleUrls  : ['./property-details.component.css'],
  imports    : [
    CommonModule, FormsModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,MatDialogModule,MatButtonModule,
  ]
})
export class PropertyDetailsComponent implements OnInit {

  processing = false;
  private paymentElem!: StripePaymentElement;
  private clientSecret = '';
  property   : any;
  busyDates  : Date[] = [];
  private busySet = new Set<number>();

  // ─── new ─── block all past
  minDate = new Date();
  start : Date | null = null;
  end   : Date | null = null;
  numberOfNights = 1;
  totalPrice     = 0;
  /* ─── new ─── only allow dates that are BOTH ≥ today and not in busySet */
  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return day >= this.minDate.getTime() && !this.busySet.has(day);
  };
  role        = localStorage.getItem('role');
  currentUser = { id: +(localStorage.getItem('userId') ?? '0') };
  amenities = [
    { key: 'wifi',                   label: 'Wifi',                   icon: 'bi-wifi' },
    { key: 'kitchen',                label: 'Cuisine',                icon: 'bi-house-door' },
    { key: 'pool',                   label: 'Piscine',                icon: 'bi-water' },
    { key: 'hotTub',                 label: 'Bain à remous',          icon: 'bi-droplet-half' },
    { key: 'airConditioning',        label: 'Climatisation',          icon: 'bi-snow' },
    { key: 'heating',                label: 'Chauffage',              icon: 'bi-thermometer-half' },
    { key: 'washer',                 label: 'Lave-linge',             icon: 'bi-droplet' },
    { key: 'dryer',                  label: 'Sèche-linge',            icon: 'bi-fan' },
    { key: 'freeParkingOnPremises',  label: 'Parking gratuit',        icon: 'bi-car-front' },
    { key: 'bbqGrill',               label: 'Barbecue',               icon: 'bi-fire' },
    { key: 'gym',                    label: 'Salle de sport',         icon: 'bi-dumbbell' },
    { key: 'petsAllowed',            label: 'Animaux acceptés',       icon: 'bi-paw' },
    { key: 'smokeAlarm',             label: 'Détecteur de fumée',     icon: 'bi-exclamation-triangle' },
    { key: 'carbonMonoxideAlarm',    label: 'Détecteur CO',           icon: 'bi-exclamation-triangle-fill' },
    { key: 'firstAidKit',            label: 'Trousse de secours',     icon: 'bi-briefcase' },
    { key: 'hairDryer',              label: 'Sèche-cheveux',          icon: 'bi-wind' },
    { key: 'coffeeMaker',            label: 'Machine à café',         icon: 'bi-cup-hot' }
  ];

  /* get a handle on <mat-date-range-input> so we can
     read its .value directly in (dateChange) */
  @ViewChild(MatDateRangeInput, { static: false })
  rangeInput!: MatDateRangeInput<Date>;

  constructor(
    private route  : ActivatedRoute,
    private http   : HttpClient,
    private stripe : StripeService,
    private dialog : MatDialog,) {}

  /* ────────── INIT ────────── */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`${environment.apiUrl}/property/${id}`)
      .subscribe(p => { this.property = p; this.updateTotal(); });

    // load busy dates…
    this.http.get<string[]>(`${environment.apiUrl}/property/${id}/busy`)
      .subscribe(isos => {
        this.busyDates = isos.map(s => new Date(s));
        // normalize to midnight and fill the set
        this.busyDates.forEach(d => {
          const m = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          this.busySet.add(m);
        });
      });
  }

  /* ────────── CALENDAR ────────── */
  onRangeChange(): void {
    /* read the current range from the control */
    const rng: DateRange<Date|null> = this.rangeInput.value
      ?? new DateRange<Date|null>(null, null);

    this.start = rng.start;
    this.end   = rng.end;

    if (this.start && this.end) {
      this.numberOfNights =
        differenceInCalendarDays(this.end, this.start);
      this.updateTotal();
    }
  }

  /** enable everything that is NOT in busyDates[] */
  isDateEnabled = (d: Date | null): boolean =>
    !!d && !this.busyDates.some(
      b => b.toDateString() === d.toDateString()
    );

  /* ────────── STRIPE ────────── */
  reserve(): void {
    if (!this.start || !this.end) {
      alert('Choisissez vos dates avant de réserver.');
      return;
    }

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width : '480px',
      data  : {
        propertyId: this.property.id,
        clientId:   this.currentUser.id,
        nights:     this.numberOfNights,
        amountTnd:  this.totalPrice,
        startIso:   this.start.toISOString(),
        endIso:     this.end.toISOString(),
      }
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        // 1) congratulate…
        alert('🎉 Votre réservation est confirmée ! Merci et à bientôt.');
        // 2) reload so the calendar re-fetches busy dates
        window.location.reload();
      }
    });
  }

  /* helper */
  private updateTotal(): void {
    if (this.property?.pricePerNight) {
      this.totalPrice = this.property.pricePerNight * this.numberOfNights;
    }
  }
}
