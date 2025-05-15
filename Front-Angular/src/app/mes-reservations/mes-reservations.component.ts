import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation.model';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {environment} from '../../environments/environments';

@Component({
  selector: 'app-mes-reservations',
  templateUrl: './mes-reservations.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    CurrencyPipe
  ],
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {
  role: string | null = null;
  reservations: Reservation[] = [];
  expandedReservationId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.http.get<Reservation[]>(`${environment.apiUrl}/reservations/mes-reservations`)
      .subscribe({
        next: (res) => this.reservations = res.reverse(),
        error: (err) => console.error(err)
      });
  }

  toggleDetails(id: number): void {
    this.expandedReservationId = this.expandedReservationId === id ? null : id;
  }
}
