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
