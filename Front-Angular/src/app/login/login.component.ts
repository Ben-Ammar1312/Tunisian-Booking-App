import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth.service';
import { Router, RouterModule } from '@angular/router'; // ✅ Import du Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
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

}

