import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

import { NgIf } from '@angular/common';
import { StandardNavbarComponent } from '../shared/standard-navbar/standard-navbar.component';
import { PropNavbarComponent }     from '../shared/prop-navbar/prop-navbar.component';
import { ClientNavbarComponent }   from '../shared/client-navbar/client-navbar.component';
import { FooterComponent }         from '../shared/footer/footer.component';

@Component({
  selector:    'app-home',
  standalone:  true,
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.css'],   // optional; could remove if empty
  imports: [
    NgIf,
    StandardNavbarComponent,
    PropNavbarComponent,
    ClientNavbarComponent,
  ]
})
export class HomeComponent implements OnInit {

  role: string | null = null;
  isLoggedIn = false;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.role       = localStorage.getItem('role');
    this.isLoggedIn = !!localStorage.getItem('token');

    /* keep live updates when user logs in/out in this session */
    this.authService.role$.subscribe(r => {
      this.role       = r;
      this.isLoggedIn = !!r;
    });
  }
}
