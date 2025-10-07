
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
class RouterGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authInfo = this.authService.authInfo();
    if (authInfo) {
      this.router.navigate(['']);
      return false
    } else {
      return true;
    }
  }
}

export const routerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(RouterGuard).canActivate(route, state);
};
