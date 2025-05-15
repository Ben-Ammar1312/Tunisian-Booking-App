import {AfterViewInit, Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {FormsModule} from '@angular/forms';
import {Property} from '../../models/property.model';
import {DarnaAiService} from '../../Services/darna-ai.service';

@Component({
  standalone: true,
  selector: 'app-prop-navbar',
  imports: [
    RouterLink, RouterLinkActive, FormsModule
  ],
  templateUrl: './prop-navbar.component.html',
  styleUrl: './prop-navbar.component.css'
})
export class PropNavbarComponent  {
  userName = '';
  searchQuery = '';
  searchResults: Property[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private ai: DarnaAiService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.userName = localStorage.getItem('fullName') || 'Utilisateur';
  }



  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.authService.setIsLoggedIn(false);
    this.authService.setUserRole(null);
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
  onSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;

    this.ai.search(q /*, éventuellement nombre de résultats */)
      .subscribe({
        next: hits => {
          // navigation vers /search avec queryParams et state
          this.router.navigate(['/search'], {
            queryParams: { q },
            state:      { results: hits }
          });
          this.searchQuery = '';      // vider le champ si besoin
        },
        error: err => console.error('Search error', err)
      });
  }

}
