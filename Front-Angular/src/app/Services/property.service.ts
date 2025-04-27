// src/app/services/property.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {


  constructor(private http: HttpClient) { }

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(environment.apiUrl + '/property');
  }



  // Fetch properties for a specific user
  getPropertiesForUser(userId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${environment.apiUrl}/property/mes-annonces/${userId}`);
  }
}
