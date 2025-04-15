import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {FooterComponent} from '../shared/footer/footer.component';

@Component({
  selector: 'app-ajouter-annonce',
  imports: [
    ReactiveFormsModule,
    PropNavbarComponent,
    FooterComponent
  ],
  templateUrl: './ajouter-annonce.component.html'
})
export class AjouterAnnonceComponent {
  annonceForm: FormGroup;
  selectedFiles: File[] = [];
  uploadedImageUrls: string[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.annonceForm = this.fb.group({
      name: [''],
      location: [''],
      description: [''],
      pricePerNight: [0],
      type: ['']
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'darna_anon_upload'); // from Cloudinary settings

    const result: any = await this.http
      .post('https://api.cloudinary.com/v1_1/dn8rkdgrv/image/upload', formData)
      .toPromise();

    return result.secure_url;
  }

  async submitAnnonce() {
    for (const file of this.selectedFiles) {
      const url = await this.uploadToCloudinary(file);
      this.uploadedImageUrls.push(url);
    }

    const propertyData = {
      ...this.annonceForm.value,
      images: this.uploadedImageUrls,
      proprietaireId: localStorage.getItem('id') // Replace with actual logged-in user ID
    };


    this.http.post('https://localhost:7130/api/property', propertyData)
      .subscribe({
        next: (response) => {
          alert('Annonce ajoutée avec succès !');
          this.router.navigate(['/dashboard-proprietaire']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'annonce:', err);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      });

  }
}
