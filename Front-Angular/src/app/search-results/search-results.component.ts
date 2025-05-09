import {Component, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../models/property.model';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FooterComponent} from '../shared/footer/footer.component';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, FooterComponent, ClientNavbarComponent],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent {
  query = '';
  results: Property[] = [];

  constructor(private route: ActivatedRoute) {
    // 1) query parameter
    this.query = this.route.snapshot.queryParamMap.get('q') ?? '';

    // 2) hits passed via router state (fastest)
    this.results = history.state.results ?? [];

    // 3) Fallback: if user refreshes the page or comes from a bookmark ➜ call the API again
    if (!this.results.length && this.query) {
      // lazy-load DarnaAiService only when needed
      import('../../app/Services/darna-ai.service').then(m => {
        const svc = new m.DarnaAiService(inject(HttpClient));
        svc.search(this.query).subscribe(r => this.results = r);
      });
    }
  }
}
