import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import {FooterComponent} from '../shared/footer/footer.component';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {StandardNavbarComponent} from '../shared/standard-navbar/standard-navbar.component'; // ✅ Import du Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent, StandardNavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  role: string | null = null;
  isLoggedIn = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    const token = localStorage.getItem('token'); // or check for "role"
    this.isLoggedIn = !!token;
    this.role = localStorage.getItem("role");

    this.authService.role$.subscribe(role => {
      this.role = role;
      this.isLoggedIn = !!role;
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Connexion réussie :', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('id', response.id);

          // ✅ Ajout de logs pour voir ce qu'il se passe
          console.log('Rôle reçu :', response.role);

          if (response.role.toLowerCase() === 'client') {
            console.log('Tentative de redirection vers /dashboard-client');
            this.router.navigate(['/dashboard-client']);
          } else if (response.role.toLowerCase() === 'proprietaire') {
            console.log('Tentative de redirection vers /dashboard-proprietaire');
            this.router.navigate(['/dashboard-proprietaire']);
          } else {
            console.log('Rôle inconnu, redirection vers /login');
            this.router.navigate(['/login']);
          }

        },
        error: () => {
          this.errorMessage = "Email ou mot de passe incorrect.";
          setTimeout(() => { this.errorMessage = ''; }, 5000);
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    // Note : Vérifiez que la route est bien '/signup' ou '/sign-up' selon votre choix
    this.router.navigate(['/signup']);
  }

}

