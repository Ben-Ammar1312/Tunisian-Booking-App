import {AfterViewInit, Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../Services/auth.service';

@Component({
  selector: 'app-prop-navbar',
  imports: [
    RouterLink,RouterLinkActive
  ],
  templateUrl: './prop-navbar.component.html',
  styleUrl: './prop-navbar.component.css'
})
export class PropNavbarComponent {
  userName: string = '';

  ngOnInit() {
    this.userName = localStorage.getItem('fullName') || 'Utilisateur';
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
