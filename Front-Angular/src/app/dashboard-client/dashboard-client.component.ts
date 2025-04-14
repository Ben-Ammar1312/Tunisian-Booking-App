// src/app/dashboard-client/dashboard-client.component.ts
import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../Services/property.service';
import { Property } from '../models/property.model';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {FooterComponent} from '../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  imports: [
    NgForOf,
    CurrencyPipe,
    ClientNavbarComponent,
    FooterComponent
  ],
  styleUrls: ['./dashboard-client.component.css']
})
export class DashboardClientComponent implements OnInit {
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
