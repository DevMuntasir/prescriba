import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformFacilityDto } from '../dto-models/models';
import type { PlatformFacilityInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformFacilityService {
  apiName = 'Default';
  

  create = (input: PlatformFacilityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFacilityDto>({
      method: 'POST',
      url: '/api/app/platform-facility',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFacilityDto>({
      method: 'GET',
      url: `/api/app/platform-facility/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFacilityDto[]>({
      method: 'GET',
      url: '/api/app/platform-facility',
    },
    { apiName: this.apiName,...config });
  

  getServiceList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFacilityDto[]>({
      method: 'GET',
      url: '/api/app/platform-facility/service-list',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformFacilityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFacilityDto>({
      method: 'PUT',
      url: '/api/app/platform-facility',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
