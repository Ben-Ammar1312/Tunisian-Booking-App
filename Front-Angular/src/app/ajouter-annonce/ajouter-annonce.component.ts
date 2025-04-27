import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { locationMap, typeMap } from '../maps';
import {CommonModule} from '@angular/common';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import { environment } from '../../environments/environments';
import {FooterComponent} from '../shared/footer/footer.component';

interface Amenity { key: string; label: string; }

@Component({
  selector: 'app-ajouter-annonce',
  standalone: true,                  // ★  add this
  imports: [                         // ★  and keep this list
    CommonModule,                    // gives *ngFor, number pipe, etc.
    ReactiveFormsModule,
    PropNavbarComponent
  ],
  templateUrl: './ajouter-annonce.component.html',
})
export class AjouterAnnonceComponent {

  annonceForm: FormGroup;
  predictedPrice: number | null = null;

  selectedFiles: File[] = [];
  uploadedImageUrls: string[] = [];

  wilayas = Object.keys(locationMap);
  propTypes = Object.keys(typeMap);

  amenities: Amenity[] = [
    { key: 'wifi',                     label: 'Wi‑Fi' },
    { key: 'kitchen',                  label: 'Cuisine' },
    { key: 'pool',                     label: 'Piscine' },
    { key: 'hot_tub',                  label: 'Jacuzzi' },
    { key: 'air_conditioning',         label: 'Climatisation' },
    { key: 'heating',                  label: 'Chauffage' },
    { key: 'washer',                   label: 'Machine à laver' },
    { key: 'dryer',                    label: 'Sèche‑linge' },
    { key: 'free_parking_on_premises', label: 'Parking' },
    { key: 'bbq_grill',                label: 'Barbecue' },
    { key: 'gym',                      label: 'Salle de sport' },
    { key: 'pets_allowed',             label: 'Animaux OK' },
    { key: 'smoke_alarm',              label: 'Détecteur fumée' },
    { key: 'carbon_monoxide_alarm',    label: 'Détecteur CO' },
    { key: 'first_aid_kit',            label: 'Kit de secours' },
    { key: 'hair_dryer',               label: 'Sèche‑cheveux' },
    { key: 'coffee_maker',             label: 'Cafetière' }
  ];

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private router: Router) {

    // ---- BUILD REACTIVE FORM ----
    const amenityControls: any = {};
    this.amenities.forEach(a => amenityControls[a.key] = [false]);

    this.annonceForm = this.fb.group({
      guests:      [1,  Validators.required],
      bedrooms:    [1,  Validators.required],
      beds:        [1,  Validators.required],
      bathrooms:   [1,  Validators.required],
      location:    ['', Validators.required],
      type:        ['', Validators.required],
      pricePerNight: [0, Validators.required],
      name:        [''],
      description: [''],
      ...amenityControls
    });
  }

  /* ========== PREDICTION ========== */
  predict(): void {
    if (this.annonceForm.invalid) { return; }

    const f = this.annonceForm.value;

    // Build PredictionInput with correct order & types
    const body = {
      f0:  f.guests,
      f1:  f.bedrooms,
      f2:  f.beds,
      f3:  f.bathrooms,

      // amenities as 0/1
      f4:  f.wifi                     ? 1 : 0,
      f5:  f.kitchen                  ? 1 : 0,
      f6:  f.pool                     ? 1 : 0,
      f7:  f.hot_tub                  ? 1 : 0,
      f8:  f.air_conditioning         ? 1 : 0,
      f9:  f.heating                  ? 1 : 0,
      f10: f.washer                   ? 1 : 0,
      f11: f.dryer                    ? 1 : 0,
      f12: f.free_parking_on_premises ? 1 : 0,
      f13: f.bbq_grill               ? 1 : 0,
      f14: f.gym                     ? 1 : 0,
      f15: f.pets_allowed            ? 1 : 0,
      f16: f.smoke_alarm             ? 1 : 0,
      f17: f.carbon_monoxide_alarm   ? 1 : 0,
      f18: f.first_aid_kit           ? 1 : 0,
      f19: f.hair_dryer              ? 1 : 0,
      f20: f.coffee_maker            ? 1 : 0,

      // categorical integers
      f21: locationMap[f.location] ?? -1,
      f22: typeMap[f.type]         ?? -1
    };

    this.http
      .post<number>(environment.apiUrl + '/priceprediction/predict', body)
      .subscribe({
        next: price => {
          this.predictedPrice = price;
          // autofill pricePerNight so user can accept or tweak
          this.annonceForm.patchValue({ pricePerNight: Math.round(price) });
        },
        error: err => alert('Erreur de prédiction : ' + err.message)
      });
  }

  /* ========== IMAGE UPLOAD & SUBMIT (unchanged from your code) ========== */
  onFileSelected(e: any) { this.selectedFiles = Array.from(e.target.files); }

  async uploadToCloudinary(file: File): Promise<string> {
    /* identical to your original method */
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', environment.uploadPreset);
    const res: any = await this.http
      .post('https://api.cloudinary.com/v1_1/' + environment.cloudinaryName + '/image/upload', fd)
      .toPromise();
    return res.secure_url;
  }

  async submitAnnonce() {
    for (const f of this.selectedFiles) {
      const url = await this.uploadToCloudinary(f);
      this.uploadedImageUrls.push(url);
    }

    const propertyData = {
      ...this.annonceForm.value,
      images: this.uploadedImageUrls,
      proprietaireId: localStorage.getItem('id')
    };

    console.log(propertyData);

    this.http.post(environment.apiUrl +'/property', propertyData)
      .subscribe({
        next: () => {
          alert('Annonce ajoutée avec succès !');
          this.router.navigate(['/dashboard-proprietaire']);
        },
        error: err => alert('Erreur ajout annonce : ' + err.message)
      });
  }
}
