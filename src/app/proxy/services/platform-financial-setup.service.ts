import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlatformFinancialSetupDto } from '../dto-models/models';
import type { PlatformFinancialSetupInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PlatformFinancialSetupService {
  apiName = 'Default';
  

  create = (input: PlatformFinancialSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFinancialSetupDto>({
      method: 'POST',
      url: '/api/app/platform-financial-setup',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFinancialSetupDto>({
      method: 'GET',
      url: `/api/app/platform-financial-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFinancialSetupDto[]>({
      method: 'GET',
      url: '/api/app/platform-financial-setup',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PlatformFinancialSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlatformFinancialSetupDto>({
      method: 'PUT',
      url: '/api/app/platform-financial-setup',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
