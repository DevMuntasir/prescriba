import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { PatientProfileDto, PatientReturnDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class PatientProfileSearchService {
  apiName = 'Default';

  getPatientProfileByMobileNo = (
    mobileNo?: string,
    creatorEntityId?: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, ApiResponse<PatientReturnDto[]>>(
      {
        method: 'GET',
        url: `/api/app/patient-profile-search/patient-profile-by-mobile-no/${creatorEntityId}`,
        params: { mobileNo },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
