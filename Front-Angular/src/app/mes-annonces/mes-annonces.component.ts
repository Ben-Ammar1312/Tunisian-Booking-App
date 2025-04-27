import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../Services/property.service';  // Import the service
import { Property } from '../models/property.model';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {RouterLink} from '@angular/router';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';  // Import the model

@Component({
  selector: 'app-mes-annonces',
  templateUrl: './mes-annonces.component.html',
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    PropNavbarComponent,
    RouterLink
  ],
  styleUrls: ['./mes-annonces.component.css']
})
export class MesAnnoncesComponent implements OnInit {
  role: string | null = null;

  properties: Property[] = [];
  userId: number = 2;  // Use the actual logged-in user's ID, for testing use a hardcoded ID.

  constructor(private propertyService: PropertyService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    this.fetchProperties();
  }

  // Method to fetch properties for the user
  fetchProperties(): void {
    this.propertyService.getPropertiesForUser(this.userId).subscribe(
      (data) => {
        this.properties = data;
        console.log('Fetched properties:', this.properties);
      },
      (error) => {
        console.error('Error fetching properties: ', error);
      }
    );
  }

  deleteProperty(propertyId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      this.http.delete(`${environment.apiUrl}/property/${propertyId}`)
        .subscribe({
          next: () => {
            this.properties = this.properties.filter(p => p.id !== propertyId);
            console.log('Property deleted successfully.');
          },
          error: (error) => {
            console.error('Error deleting property:', error);
          }
        });
    }
  }

}
