import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-standard-navbar',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './standard-navbar.component.html'
})
export class StandardNavbarComponent {

  constructor(private router: Router) {}

  goToLogin()  { this.router.navigate(['/login']);  }
  goToSignup() { this.router.navigate(['/signup']); }
}
