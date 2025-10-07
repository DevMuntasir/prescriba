import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformServiceDto } from '../dto-models/models';
import type { PlatformServiceInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  apiName = 'Default';
  

  create = (input: PlatformServiceInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformServiceDto>({
      method: 'POST',
      url: '/api/app/platform',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformServiceDto>({
      method: 'GET',
      url: `/api/app/platform/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformServiceDto[]>({
      method: 'GET',
      url: '/api/app/platform',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformServiceInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformServiceDto>({
      method: 'PUT',
      url: '/api/app/platform',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
