// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../Services/auth.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  private tokenValid(token: string | null): boolean {
    if (!token) { return false; }
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 > Date.now();           // not expired
    } catch { return false; }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state : RouterStateSnapshot
  ): boolean | UrlTree {

    if (this.tokenValid(localStorage.getItem('token'))) {
      return true;                              // let Angular display the page
    }
    // remember where the user wanted to go
    return this.router.createUrlTree(['/login'], {
      queryParams : { returnUrl: state.url }
    });
  }
}
