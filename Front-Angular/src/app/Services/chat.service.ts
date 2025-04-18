import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/chat-message';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(userInput: string, topK = 5): Observable<ChatResponse> {
    const payload: ChatRequest = { userInput, topK };
    return this.http.post<ChatResponse>(`${this.base}/chat`, payload);
  }
}
