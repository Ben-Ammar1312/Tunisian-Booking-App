// src/app/mes-annonces/mes-annonces.component.ts
import { Component, OnInit }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { NgIf, NgForOf }        from '@angular/common';
import { CurrencyPipe }         from '@angular/common';
import { RouterLink }           from '@angular/router';
import { PropNavbarComponent }  from '../shared/prop-navbar/prop-navbar.component';
import { PropertyService }      from '../Services/property.service';
import { HttpClient }           from '@angular/common/http';
import { environment }          from '../../environments/environments';
import { Property }             from '../models/property.model';

@Component({
  selector: 'app-mes-annonces',
  standalone: true,                        // ← add this
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    CurrencyPipe,
    RouterLink,
    PropNavbarComponent
  ],
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.css']
})
export class MesAnnoncesComponent implements OnInit {
  role: string | null = null;
  userId!: number;            // set below
  properties: Property[] = [];

  constructor(
    private propertyService: PropertyService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // get role & userId from localStorage:
    this.role   = localStorage.getItem('role');
    const idStr = localStorage.getItem('id');
    this.userId = idStr ? +idStr : 0;

    this.fetchProperties();
  }

  fetchProperties(): void {
    if (!this.userId) {
      console.warn('No userId, skipping fetch');
      return;
    }

    const url = `${environment.apiUrl}/property/mes-annonces/${this.userId}`;
    console.log('🔍 fetching MesAnnonces from', url);
    this.propertyService.getPropertiesForUser(this.userId)
      .subscribe({
        next: props => {
          console.log('⚙️ got back', props.length, 'properties', props);
          this.properties = props;
        },
        error: err => {
          console.error('❌ Error fetching properties', err);
        }
      });
  }

  deleteProperty(propertyId: number) {
    if (!confirm('Êtes-vous sûr ?')) return;

    this.http
      .delete(`${environment.apiUrl}/property/${propertyId}`)
      .subscribe({
        next: () => {
          this.properties = this.properties.filter(p => p.id !== propertyId);
          console.log('Annonce supprimée');
        },
        error: err => console.error('Erreur suppression', err)
      });
  }
}
