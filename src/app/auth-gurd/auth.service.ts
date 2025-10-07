import { AuthService } from 'src/app/shared/services/auth.service';
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
class AuthServiceGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authInfo = this.authService.authInfo();

    if (authInfo) {
      const userType = authInfo.userType;
      const targetUserType = state.url.split('/')[1];

      if (userType === targetUserType) {
        return true;
      } else {
        const loginUrl =  targetUserType == 'agent' ? `/${targetUserType}/login` : '/login'
        this.router.navigate([ loginUrl]);
        return false;
      }
    } else {
      const loginUrl = state.url.startsWith('/agent') ? '/agent/login' : '/login';
      this.router.navigate([loginUrl]);
      return false;
    }
  }
}

export const isAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AuthServiceGuard).canActivate(route, state);
};
