import {Component, OnInit} from '@angular/core';
import {Property} from '../models/property.model';
import {PropertyService} from '../Services/property.service';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {FooterComponent} from '../shared/footer/footer.component';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard-proprietaire',
  imports: [
    CurrencyPipe,
    FooterComponent,
    NgForOf,
    PropNavbarComponent,
    RouterLink
  ],
  templateUrl: './dashboard-proprietaire.component.html',
  styleUrl: './dashboard-proprietaire.component.css'
})
export class DashboardProprietaireComponent implements OnInit {
  properties: Property[] = [];

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        console.log('Received properties:', data);
        this.properties = data;

      },

      error: (err) => console.error('Error fetching properties:', err)
    });
  }
}
