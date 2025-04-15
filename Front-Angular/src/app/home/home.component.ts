import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FooterComponent} from '../shared/footer/footer.component';
import {NgIf} from '@angular/common';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {AuthService} from '../Services/auth.service';
import {StandardNavbarComponent} from '../shared/standard-navbar/standard-navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    FooterComponent,
    NgIf,
    RouterLink,
    ClientNavbarComponent,
    PropNavbarComponent,
    StandardNavbarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  role: string | null = null;
  isLoggedIn = false;


  ngOnInit() {
    const token = localStorage.getItem('token'); // or check for "role"
    this.isLoggedIn = !!token;
    this.role = localStorage.getItem("role");

    this.authService.role$.subscribe(role => {
      this.role = role;
      this.isLoggedIn = !!role;
    });

  }

  constructor(private router: Router, private authService: AuthService) {}



}
