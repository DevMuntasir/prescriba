import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DoctorDegreeDto } from '../dto-models/models';
import type { DoctorDegreeInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorDegreeService {
  apiName = 'Default';
  

  create = (input: DoctorDegreeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto>({
      method: 'POST',
      url: '/api/app/doctor-degree',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/doctor-degree/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto>({
      method: 'GET',
      url: `/api/app/doctor-degree/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDoctorDegreeListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto[]>({
      method: 'GET',
      url: `/api/app/doctor-degree/doctor-degree-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto[]>({
      method: 'GET',
      url: '/api/app/doctor-degree',
    },
    { apiName: this.apiName,...config });
  

  getListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto[]>({
      method: 'GET',
      url: `/api/app/doctor-degree/by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: DoctorDegreeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorDegreeDto>({
      method: 'PUT',
      url: '/api/app/doctor-degree',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
