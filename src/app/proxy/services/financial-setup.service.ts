import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FinancialSetupDto } from '../dto-models/models';
import type { FacilityEntityType } from '../enums/facility-entity-type.enum';
import type { FinancialSetupInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class FinancialSetupService {
  apiName = 'Default';
  

  create = (input: FinancialSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FinancialSetupDto>({
      method: 'POST',
      url: '/api/app/financial-setup',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/financial-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FinancialSetupDto>({
      method: 'GET',
      url: `/api/app/financial-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, FinancialSetupDto[]>({
      method: 'GET',
      url: '/api/app/financial-setup',
    },
    { apiName: this.apiName,...config });
  

  getListByProviderIdandType = (providerType: FacilityEntityType, providerId: number, userRole: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FinancialSetupDto[]>({
      method: 'GET',
      url: `/api/app/financial-setup/by-provider-idand-type/${providerId}`,
      params: { providerType, userRole },
    },
    { apiName: this.apiName,...config });
  

  getToalDiscountAmountTotalProviderAmount = (amount: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/financial-setup/toal-discount-amount-total-provider-amount',
      params: { amount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: FinancialSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FinancialSetupDto>({
      method: 'PUT',
      url: '/api/app/financial-setup',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
