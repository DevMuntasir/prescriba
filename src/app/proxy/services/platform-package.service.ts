import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformPackageDto } from '../dto-models/models';
import type { PlatformPackageInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformPackageService {
  apiName = 'Default';
  

  create = (input: PlatformPackageInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageDto>({
      method: 'POST',
      url: '/api/app/platform-package',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/platform-package/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageDto>({
      method: 'GET',
      url: `/api/app/platform-package/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageDto[]>({
      method: 'GET',
      url: '/api/app/platform-package',
    },
    { apiName: this.apiName,...config });
  

  getPlatformPackageListByAgentMasterId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageDto[]>({
      method: 'GET',
      url: `/api/app/platform-package/platform-package-list-by-agent-master-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformPackageInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageDto>({
      method: 'PUT',
      url: '/api/app/platform-package',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
