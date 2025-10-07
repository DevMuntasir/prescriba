import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type {
  AppointmentDto,
  AppointmentStateDto,
  DashboardDto,
  DashboardStateDto,
  ExtendedAppointmentDto,
} from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiName = 'Default';

  getDashboadDataForDoctor = (
    doctorid: number,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DashboardStateDto>(
      {
        method: 'GET',
        url: '/api/app/dashboard/dashboad-data-for-doctor',
        params: { doctorid },
      },
      { apiName: this.apiName, ...config }
    );

  getDashboadDataForPatient = (
    patientId: number,
    role: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DashboardDto>(
      {
        method: 'GET',
        url: `/api/app/dashboard/dashboad-data-for-patient/${patientId}`,
        params: { role },
      },
      { apiName: this.apiName, ...config }
    );

  getDashboardAppointmentListForDoctor = (
    doctorId: number,
    day: string,
    chamber?: boolean,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, ExtendedAppointmentDto>(
      {
        method: 'GET',
        url: `/api/app/dashboard/dashboard-appointment-list-for-doctor/${doctorId}`,
        params: { chamber, day },
      },
      { apiName: this.apiName, ...config }
    );

  getDashboardAppointmentListForPatient = (
    patientId: number,
    role: string,
    day: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, AppointmentDto[]>(
      {
        method: 'GET',
        url: `/api/app/dashboard/dashboard-appointment-list-for-patient/${patientId}`,
        params: { role, day },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
