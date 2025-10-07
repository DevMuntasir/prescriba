import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DrugRxDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DrugRxService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DrugRxDto>({
      method: 'GET',
      url: `/api/app/drug-rx/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDrugNameSearchList = (searchDrug?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DrugRxDto[]>({
      method: 'GET',
      url: '/api/app/drug-rx/drug-name-search-list',
      params: { searchDrug },
    },
    { apiName: this.apiName,...config });
  

  getDrugWithLimitList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DrugRxDto[]>({
      method: 'GET',
      url: '/api/app/drug-rx/drug-with-limit-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DrugRxDto[]>({
      method: 'GET',
      url: '/api/app/drug-rx',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
