import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DoctorScheduleDaySessionDto, DoctorScheduleDaySessionInputDto, ResponseDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorScheduleDaySessionService {
  apiName = 'Default';
  

  createSession = (input: DoctorScheduleDaySessionInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>({
      method: 'POST',
      url: '/api/app/doctor-schedule-day-session/session',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getSession = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDaySessionDto>({
      method: 'GET',
      url: `/api/app/doctor-schedule-day-session/${id}/session`,
    },
    { apiName: this.apiName,...config });
  

  getSessionList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDaySessionDto[]>({
      method: 'GET',
      url: '/api/app/doctor-schedule-day-session/session-list',
    },
    { apiName: this.apiName,...config });
  

  updateSession = (input: DoctorScheduleDaySessionInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>({
      method: 'PUT',
      url: '/api/app/doctor-schedule-day-session/session',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
