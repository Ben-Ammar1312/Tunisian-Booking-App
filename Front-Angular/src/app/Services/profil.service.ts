import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = environment.apiUrl + '/profile';

  constructor(private http: HttpClient) {
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  updateProfile(user: any): Observable<any> {
    return this.http.put(this.apiUrl, user); // or another correct endpoint
  }

}
