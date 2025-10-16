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


  constructor(private restService: RestService) {}
}
