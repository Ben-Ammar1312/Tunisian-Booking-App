import { Component, AfterViewInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  standalone:true,
  imports:[RouterLinkActive,RouterLink]
})
export class ClientNavbarComponent implements AfterViewInit {
  userName: string = '';

  ngOnInit() {
    this.userName = localStorage.getItem('fullName') || 'Utilisateur';
  }
  ngAfterViewInit() {
    const dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    dropdownTriggerList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();

    // Optional: Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Update any auth state logic you have
    this.authService.setIsLoggedIn(false);
    this.authService.setUserRole(null);

    // Navigate and reload
    this.router.navigate(['/']).then(() => {
      window.location.reload(); // Forces the view to reinitialize
    });
  }


}
