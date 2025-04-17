import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('role'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  private apiUrl = 'https://10.211.55.5:7130/api/auth/signup';

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
  login(credentials: any): Observable<any> {
    return this.http.post('https://10.211.55.5:7130/api/auth/login', credentials);
  }

  setIsLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  setUserRole(role: string | null) {
    this.roleSubject.next(role);
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }



}
