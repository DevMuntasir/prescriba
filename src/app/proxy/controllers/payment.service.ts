import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiName = 'Default';
  

  cancelledPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/payment-cancel',
    },
    { apiName: this.apiName,...config });
  

  cancelledTestPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/test/payment-cancel',
    },
    { apiName: this.apiName,...config });
  

  failedPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/payment-fail',
    },
    { apiName: this.apiName,...config });
  

  failedTestPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/test/payment-fail',
    },
    { apiName: this.apiName,...config });
  

  successPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/payment-success',
    },
    { apiName: this.apiName,...config });
  

  successTestIPNPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/test/ipn',
    },
    { apiName: this.apiName,...config });
  

  successTestPayment = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/services/test/payment-success',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
