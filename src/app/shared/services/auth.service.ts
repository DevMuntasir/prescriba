import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
//import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { UserInfoDto } from 'src/app/proxy/dto-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticated: boolean = false;
  isOtpLoading = signal(false);
  //   authUser = signal({
  //     agentMasterId
  // : 0
  // fullName
  // :
  // ""
  // id
  // :
  // 0
  // userId
  // :
  // "f4c88123-8d1d-a51b-8460-3a14146ddfb7"
  // userType
  // :
  // "agent
  //   })
  constructor(
    //private oAuthService: OAuthService,
    private _router: Router,
    private HttpClient: HttpClient
  ) {}

  setAuthInfoInLocalStorage(data: any): void {
    localStorage.removeItem('auth');
    localStorage.setItem('auth', JSON.stringify(data));
  }

  signOut(): Observable<any> {
    localStorage.clear();
    this._authenticated = false;
    this._router.navigate(['/']);
    return of(true);
  }

  authInfo(): any {
    const authData = localStorage.getItem('auth');
    return authData ? JSON.parse(authData) : null;
  }
  setOtpLoader(status: boolean) {
    this.isOtpLoading.set(status);
  }
}
