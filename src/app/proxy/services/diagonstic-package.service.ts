import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DiagonsticPackageDto } from '../dto-models/models';
import type { DiagonsticPackageInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DiagonsticPackageService {
  apiName = 'Default';
  

  create = (input: DiagonsticPackageInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageDto>({
      method: 'POST',
      url: '/api/app/diagonstic-package',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageDto>({
      method: 'GET',
      url: `/api/app/diagonstic-package/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageDto[]>({
      method: 'GET',
      url: '/api/app/diagonstic-package',
    },
    { apiName: this.apiName,...config });
  

  getPackageListByProviderId = (providerId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageDto[]>({
      method: 'GET',
      url: `/api/app/diagonstic-package/package-list-by-provider-id/${providerId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: DiagonsticPackageInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageDto>({
      method: 'PUT',
      url: '/api/app/diagonstic-package',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
