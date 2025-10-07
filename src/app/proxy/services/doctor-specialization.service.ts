import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DoctorSpecializationDto } from '../dto-models/models';
import type { DoctorSpecializationInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorSpecializationService {
  apiName = 'Default';
  

  create = (input: DoctorSpecializationInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto>({
      method: 'POST',
      url: '/api/app/doctor-specialization',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/doctor-specialization/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto>({
      method: 'GET',
      url: `/api/app/doctor-specialization/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySpecialityId = (specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto>({
      method: 'GET',
      url: `/api/app/doctor-specialization/by-speciality-id/${specialityId}`,
    },
    { apiName: this.apiName,...config });
  

  getDoctorSpecializationListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto[]>({
      method: 'GET',
      url: `/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getDoctorSpecializationListByDoctorIdSpecialityId = (doctorId: number, specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto[]>({
      method: 'GET',
      url: '/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id-speciality-id',
      params: { doctorId, specialityId },
    },
    { apiName: this.apiName,...config });
  

  getDoctorSpecializationListBySpecialityId = (specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto[]>({
      method: 'GET',
      url: `/api/app/doctor-specialization/doctor-specialization-list-by-speciality-id/${specialityId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto[]>({
      method: 'GET',
      url: '/api/app/doctor-specialization',
    },
    { apiName: this.apiName,...config });
  

  getListByDoctorIdSpId = (doctorId: number, specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto[]>({
      method: 'GET',
      url: '/api/app/doctor-specialization/by-doctor-id-sp-id',
      params: { doctorId, specialityId },
    },
    { apiName: this.apiName,...config });
  

  update = (input: DoctorSpecializationInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorSpecializationDto>({
      method: 'PUT',
      url: '/api/app/doctor-specialization',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
