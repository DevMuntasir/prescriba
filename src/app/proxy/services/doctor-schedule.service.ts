import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DoctorScheduleDto, DoctorScheduleInputDto, ResponseDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorScheduleService {
  apiName = 'Default';
  

  create = (input: DoctorScheduleInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>({
      method: 'POST',
      url: '/api/app/doctor-schedule',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createFromMobileApp = (input: DoctorScheduleInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto>({
      method: 'POST',
      url: '/api/app/doctor-schedule/from-mobile-app',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deleteSession = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>({
      method: 'DELETE',
      url: `/api/app/doctor-schedule/${id}/session`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto>({
      method: 'GET',
      url: `/api/app/doctor-schedule/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDetailsScheduleListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto[]>({
      method: 'GET',
      url: `/api/app/doctor-schedule/details-schedule-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto[]>({
      method: 'GET',
      url: '/api/app/doctor-schedule',
    },
    { apiName: this.apiName,...config });
  

  getListByDoctorIdList = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto[]>({
      method: 'GET',
      url: `/api/app/doctor-schedule/by-doctor-id-list/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getScheduleListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto[]>({
      method: 'GET',
      url: `/api/app/doctor-schedule/schedule-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: DoctorScheduleInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>({
      method: 'PUT',
      url: '/api/app/doctor-schedule',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateFromMobileApp = (input: DoctorScheduleInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorScheduleDto>({
      method: 'PUT',
      url: '/api/app/doctor-schedule/from-mobile-app',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
