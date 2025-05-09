import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { DarnaAiService } from '../../Services/darna-ai.service';
import { Property } from '../../models/property.model';
declare const bootstrap: any;

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, FormsModule ],
  templateUrl: './client-navbar.component.html'
})
export class ClientNavbarComponent implements AfterViewInit {
  userName = '';
  searchQuery = '';
  searchResults: Property[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private ai: DarnaAiService
  ) {}

  ngOnInit() {
    this.userName = localStorage.getItem('fullName') || 'Utilisateur';
  }

  ngAfterViewInit() {
    document
      .querySelectorAll('[data‑bs‑toggle="dropdown"]')
      .forEach(el => new bootstrap.Dropdown(el));
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.auth.setIsLoggedIn(false);
    this.auth.setUserRole(null);
    this.router.navigate(['/']).then(() => location.reload());
  }

  onSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;

    this.ai.search(q).subscribe({
      next: hits => {
        // navigate and push the results through the router state
        this.router.navigate(['/search'], {
          queryParams: { q },
          state:      { results: hits }
        });
        this.searchQuery = '';             // clear input if you want
      },
      error: err => console.error('Search error', err)
    });
  }
}
