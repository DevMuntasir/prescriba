import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
class AuthServiceGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authInfo = this.authService.authInfo();
    const requiredRoles = this.extractRoles(route);

    if (!authInfo) {
      this.router.navigate([this.loginRouteFor(state.url)]);
      return false;
    }

    const currentRole = this.normaliseRole(authInfo.userType);

    if (!requiredRoles.length || requiredRoles.includes(currentRole)) {
      return true;
    }

    this.router.navigate([this.dashboardRouteFor(currentRole)]);
    return false;
  }

  private extractRoles(route: ActivatedRouteSnapshot): string[] {
    const roles = route.data?.['roles'];

    if (!roles) {
      return [];
    }

    if (Array.isArray(roles)) {
      return roles.map((role) => this.normaliseRole(role));
    }

    return [this.normaliseRole(roles)];
  }

  private loginRouteFor(url: string): string {
    if (url.startsWith('/ps-admin')) {
      return '/ps-admin';
    }

    return '/login';
  }

  private dashboardRouteFor(role: string): string {
    switch (role) {
      case 'admin':
        return '/ps-admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      default:
        return '/';
    }
  }

  private normaliseRole(role: string | undefined): string {
    const value = (role || '').toLowerCase();

    if (value === 'sgadmin') {
      return 'admin';
    }

    return value;
  }
}

export const isAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AuthServiceGuard).canActivate(route, state);
};
