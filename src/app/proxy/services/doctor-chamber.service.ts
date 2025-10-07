import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DoctorChamberDto } from '../dto-models/models';
import type { DoctorChamberInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorChamberService {
  apiName = 'Default';
  

  create = (input: DoctorChamberInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorChamberDto>({
      method: 'POST',
      url: '/api/app/doctor-chamber',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorChamberDto>({
      method: 'GET',
      url: `/api/app/doctor-chamber/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDoctorChamberListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorChamberDto[]>({
      method: 'GET',
      url: `/api/app/doctor-chamber/doctor-chamber-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorChamberDto[]>({
      method: 'GET',
      url: '/api/app/doctor-chamber',
    },
    { apiName: this.apiName,...config });
  

  update = (input: DoctorChamberInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorChamberDto>({
      method: 'PUT',
      url: '/api/app/doctor-chamber',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
