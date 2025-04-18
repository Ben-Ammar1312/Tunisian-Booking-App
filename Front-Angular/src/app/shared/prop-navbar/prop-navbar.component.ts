import {AfterViewInit, Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {FormsModule} from '@angular/forms';
import {Property} from '../../models/property.model';
import {DarnaAiService} from '../../Services/darna-ai.service';

@Component({
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

    this.ai.search(q, 5).subscribe({
      next: props => {
        this.searchResults = props;
        console.log('search results:', props);
        // e.g. navigate to a search‑results page:
        // this.router.navigate(['/search'], { queryParams: { q } });
      },
      error: err => console.error('Search error', err)
    });
  }

}
