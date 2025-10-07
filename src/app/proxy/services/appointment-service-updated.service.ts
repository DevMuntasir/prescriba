import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { AppointmentPatientDto } from '../domain/service/models/appointment-dto/models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentServiceUpdatedService {
  apiName = 'Default';
  

  helloByDoctorProfileIdAndAppointmentStatusAndSearchTermAndPageNumberAndPageSize = (doctorProfileId: number, appointmentStatus: number, searchTerm: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<any<AppointmentPatientDto>>>({
      method: 'POST',
      url: `/api/app/appointment-service-updated/hello/${doctorProfileId}`,
      params: { appointmentStatus, searchTerm, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
