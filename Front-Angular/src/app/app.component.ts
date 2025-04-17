import { Component, OnInit } from '@angular/core';
import { RouterModule }      from '@angular/router';

import { AuthService }       from './Services/auth.service';
import {FooterComponent} from './shared/footer/footer.component';
import {StandardNavbarComponent} from './shared/standard-navbar/standard-navbar.component';
import {CommonModule} from '@angular/common';

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [ RouterModule, FooterComponent,CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    /* initial state (e.g. on F5 refresh) */
    this.isLoggedIn = !!localStorage.getItem('token');

    /* live updates when user logs in/out during the session */
    this.auth.isLoggedIn$.subscribe(flag => this.isLoggedIn = flag);
  }
}
