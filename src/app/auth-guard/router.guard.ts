
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
class RouterGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authInfo = this.authService.authInfo();

    if (!authInfo) {
      return true;
    }

    const userRole = this.normaliseRole(authInfo.userType);
    const destination = this.dashboardRouteFor(userRole);

    this.router.navigate([destination]);
    return false;
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

export const routerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(RouterGuard).canActivate(route, state);
};
