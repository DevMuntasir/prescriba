import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformPackageManagementDto } from '../dto-models/models';
import type { PlatformPackageManagementInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformPackageManagementService {
  apiName = 'Default';
  

  create = (input: PlatformPackageManagementInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageManagementDto>({
      method: 'POST',
      url: '/api/app/platform-package-management',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageManagementDto>({
      method: 'GET',
      url: `/api/app/platform-package-management/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageManagementDto[]>({
      method: 'GET',
      url: '/api/app/platform-package-management',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformPackageManagementInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageManagementDto>({
      method: 'PUT',
      url: '/api/app/platform-package-management',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
