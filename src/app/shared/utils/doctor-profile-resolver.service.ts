import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { DoctorProfileService } from 'src/app/proxy/services';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileResolverService {
  getProfileData(data: any) {}
}

export const profilerResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let params = route.paramMap.get('id');
  return inject(DoctorProfileService).get(Number(params));
};
