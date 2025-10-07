import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SpecializationDto } from '../dto-models/models';
import type { SpecializationInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  apiName = 'Default';
  

  create = (input: SpecializationInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto>({
      method: 'POST',
      url: '/api/app/specialization',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto>({
      method: 'GET',
      url: `/api/app/specialization/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySpecialityId = (specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto>({
      method: 'GET',
      url: `/api/app/specialization/by-speciality-id/${specialityId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto[]>({
      method: 'GET',
      url: '/api/app/specialization',
    },
    { apiName: this.apiName,...config });
  

  getListBySpecialtyId = (specialityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto[]>({
      method: 'GET',
      url: `/api/app/specialization/by-specialty-id/${specialityId}`,
    },
    { apiName: this.apiName,...config });
  

  getListFiltering = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto[]>({
      method: 'GET',
      url: '/api/app/specialization/filtering',
    },
    { apiName: this.apiName,...config });
  

  update = (input: SpecializationInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecializationDto>({
      method: 'PUT',
      url: '/api/app/specialization',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
