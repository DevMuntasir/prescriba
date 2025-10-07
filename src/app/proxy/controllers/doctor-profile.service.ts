import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { DoctorProfileDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileService {
  apiName = 'Default';
  

  getAllActiveDoctorList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<any<DoctorProfileDto>>>({
      method: 'GET',
      url: '/get-all-active-doctor',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
