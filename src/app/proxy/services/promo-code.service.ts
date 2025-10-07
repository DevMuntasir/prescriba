import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PromoCodeDto } from '../dto-models/models';
import type { PromoCodeInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  apiName = 'Default';
  

  create = (input: PromoCodeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PromoCodeDto>({
      method: 'POST',
      url: '/api/app/promo-code',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PromoCodeDto>({
      method: 'GET',
      url: `/api/app/promo-code/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PromoCodeDto>({
      method: 'GET',
      url: '/api/app/promo-code/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PromoCodeDto[]>({
      method: 'GET',
      url: '/api/app/promo-code',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PromoCodeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PromoCodeDto>({
      method: 'PUT',
      url: '/api/app/promo-code',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
