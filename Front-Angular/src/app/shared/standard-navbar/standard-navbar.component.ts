import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-standard-navbar',
  templateUrl: './standard-navbar.component.html',
  imports: [

    RouterLink
  ],
  styleUrls: ['./standard-navbar.component.css']
})
export class StandardNavbarComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
