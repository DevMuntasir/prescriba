import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { DoctorProfileResponseDto } from '../domain/service/models/doctor-profile/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileDetailsService {
  apiName = 'Default';
  

  getDoctorProfileById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<DoctorProfileResponseDto>>({
      method: 'GET',
      url: `/api/app/doctor-profile-details/${id}/doctor-profile`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
