import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://10.211.55.5:5058/api/auth/signup';

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
  login(credentials: any): Observable<any> {
    return this.http.post('http://10.211.55.5:5058/api/auth/login', credentials);
  }

}
