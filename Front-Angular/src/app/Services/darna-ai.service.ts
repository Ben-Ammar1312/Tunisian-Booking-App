// src/app/Services/darna-ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class DarnaAiService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** NL search stays the same */
  search(query: string, topK = 5): Observable<Property[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('topK', String(topK));
    return this.http.get<Property[]>(`${this.base}/search`, { params });
  }

  /**
   * Chat endpoint now treated as text.
   * We don’t even try to JSON.parse it,
   * we just grab the raw string.
   */
  chat(userInput: string, topK = 5): Observable<string> {
    return this.http
      .post<{ reply: string }>(`${this.base}/chat`, { userInput, topK })
      .pipe(
        // extract the `reply` field
        map(response => response.reply.trim())
      );
  }
}
