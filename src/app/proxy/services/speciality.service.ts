import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SpecialityDto } from '../dto-models/models';
import type { SpecialityInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  apiName = 'Default';
  

  create = (input: SpecialityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecialityDto>({
      method: 'POST',
      url: '/api/app/speciality',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecialityDto>({
      method: 'GET',
      url: `/api/app/speciality/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecialityDto[]>({
      method: 'GET',
      url: '/api/app/speciality',
    },
    { apiName: this.apiName,...config });
  

  update = (input: SpecialityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SpecialityDto>({
      method: 'PUT',
      url: '/api/app/speciality',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
