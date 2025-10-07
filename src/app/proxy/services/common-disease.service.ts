import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CommonDiseaseDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class CommonDiseaseService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommonDiseaseDto>({
      method: 'GET',
      url: `/api/app/common-disease/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDiseaseNameSearchList = (searchDisease?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommonDiseaseDto[]>({
      method: 'GET',
      url: '/api/app/common-disease/disease-name-search-list',
      params: { searchDisease },
    },
    { apiName: this.apiName,...config });
  

  getDiseaseNameWithLimitList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommonDiseaseDto[]>({
      method: 'GET',
      url: '/api/app/common-disease/disease-name-with-limit-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommonDiseaseDto[]>({
      method: 'GET',
      url: '/api/app/common-disease',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
