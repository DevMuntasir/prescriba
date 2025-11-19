import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
//import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticated: boolean = false;
  isOtpLoading = signal(false);

  constructor(private _router: Router) {}

  setAuthInfoInLocalStorage(data: any): void {
    localStorage.removeItem('auth');
    localStorage.setItem('auth', JSON.stringify(data));
  }

  signOut(): Observable<any> {
    const previousUser = this.authInfo();
    localStorage.removeItem('auth');
    localStorage.removeItem('access');
    localStorage.removeItem('refreshToken');
    this._authenticated = false;
    const destination = this.resolvePostLogoutRoute(previousUser?.userType);
    this._router.navigate([destination], { replaceUrl: true });
    return of(true);
  }

  private resolvePostLogoutRoute(role?: string): string {
    const normalised = (role || '').toLowerCase();

    if (normalised === 'admin' || normalised === 'sgadmin') {
      return '/ps-admin';
    }

    if (normalised === 'doctor') {
      return '/login';
    }

    return '/';
  }

  authInfo(): any {
    const authData = localStorage.getItem('auth');
    return authData ? JSON.parse(authData) : null;
  }
  setOtpLoader(status: boolean) {
    this.isOtpLoading.set(status);
  }
}
