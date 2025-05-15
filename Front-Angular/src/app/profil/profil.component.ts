import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfilService } from '../Services/profil.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ClientNavbarComponent } from '../shared/client-navbar/client-navbar.component';
import { PropNavbarComponent } from '../shared/prop-navbar/prop-navbar.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ClientNavbarComponent,
    PropNavbarComponent
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  role: string | null = null;
  user!: User;
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  profileForm!: FormGroup;

  constructor(
    private profilService: ProfilService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    this.profilService.getProfile().subscribe({
      next: (data) => {
        this.user = data;

        this.profileForm = this.fb.group({
          fullName: [this.user.fullName, Validators.required],
          email: [this.user.email, [Validators.required, Validators.email]],
          password: ['', [Validators.minLength(6)]] // optional, only filled if changing
        });

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement du profil.';
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.value;

      const updatedUser = {
        fullName: formValues.fullName,
        email: formValues.email,
        passwordHash: formValues.password?.trim() || undefined
      };

      this.profilService.updateProfile(updatedUser).subscribe({
        next: () => {
          this.successMessage = 'Profil mis à jour avec succès !';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour du profil.';
          console.error(err);
        }
      });
    }
  }

}
