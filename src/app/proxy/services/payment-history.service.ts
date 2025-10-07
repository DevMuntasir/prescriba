import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PaymentHistoryDto, PaymentHistoryInputDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentHistoryService {
  apiName = 'Default';
  

  create = (input: PaymentHistoryInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto>({
      method: 'POST',
      url: '/api/app/payment-history',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto>({
      method: 'GET',
      url: `/api/app/payment-history/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByAppointmentCode = (appCode: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/payment-history/by-appointment-code',
      params: { appCode },
    },
    { apiName: this.apiName,...config });
  

  getByTranId = (tranId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto>({
      method: 'GET',
      url: `/api/app/payment-history/by-tran-id/${tranId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto[]>({
      method: 'GET',
      url: '/api/app/payment-history',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PaymentHistoryInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto>({
      method: 'PUT',
      url: '/api/app/payment-history',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateHistory = (input: PaymentHistoryInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: '/api/app/payment-history/history',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
