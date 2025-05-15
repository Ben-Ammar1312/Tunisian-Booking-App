import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../models/property.model';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {DarnaAiService} from '../Services/darna-ai.service';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, ClientNavbarComponent],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  query = '';
  results: Property[] = [];
  private firstRun = true;    // pour ne consommer history.state qu’une fois

  constructor(
    private route: ActivatedRoute,
    private ai: DarnaAiService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe(params => {
        const q = params.get('q')?.trim() ?? '';
        this.query = q;
        // Premier passage : essayer d’utiliser history.state.results
        if (this.firstRun) {
          this.results = history.state.results ?? [];
          this.firstRun = false;
          if (this.results.length) {
            return;  // on a nos hits, pas besoin de relancer l’API
          }
        }

        // Sinon, si on a un q, on interroge l’API
        if (q) {
          this.ai.search(q).subscribe({
            next: hits => this.results = hits,
            error: err => console.error('Search error', err)
          });
        } else {
          this.results = [];
        }
      });
  }
}
