import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import {FooterComponent} from '../shared/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  registrationSuccess: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Formulaire soumis :', this.signupForm.value);
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Inscription réussie, réponse API :', response);
          this.registrationSuccess = true;
          this.signupForm.reset();
          setTimeout(() => {
            this.registrationSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
          this.errorMessage = "Une erreur est survenue lors de l'inscription.";
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }
}
