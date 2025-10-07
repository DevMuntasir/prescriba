import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformPackageFacilityDto } from '../dto-models/models';
import type { PlatformPackageFacilityInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformPackageFacilityService {
  apiName = 'Default';
  

  create = (input: PlatformPackageFacilityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageFacilityDto>({
      method: 'POST',
      url: '/api/app/platform-package-facility',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/platform-package-facility/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageFacilityDto>({
      method: 'GET',
      url: `/api/app/platform-package-facility/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageFacilityDto[]>({
      method: 'GET',
      url: '/api/app/platform-package-facility',
    },
    { apiName: this.apiName,...config });
  

  getPlatformPackageFacilityListByPlatformPackageId = (platformPackageId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageFacilityDto[]>({
      method: 'GET',
      url: `/api/app/platform-package-facility/platform-package-facility-list-by-platform-package-id/${platformPackageId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformPackageFacilityInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformPackageFacilityDto>({
      method: 'PUT',
      url: '/api/app/platform-package-facility',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
