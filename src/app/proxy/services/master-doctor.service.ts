import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { MasterDoctorDto } from '../dto-models/models';
import type { MasterDoctorInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class MasterDoctorService {
  apiName = 'Default';
  

  create = (input: MasterDoctorInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto>({
      method: 'POST',
      url: '/api/app/master-doctor',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/master-doctor/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto>({
      method: 'GET',
      url: `/api/app/master-doctor/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto[]>({
      method: 'GET',
      url: '/api/app/master-doctor',
    },
    { apiName: this.apiName,...config });
  

  getListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto[]>({
      method: 'GET',
      url: `/api/app/master-doctor/by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getMasterDoctorListByAgentMasterId = (masterId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto[]>({
      method: 'GET',
      url: `/api/app/master-doctor/master-doctor-list-by-agent-master-id/${masterId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: MasterDoctorInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MasterDoctorDto>({
      method: 'PUT',
      url: '/api/app/master-doctor',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
