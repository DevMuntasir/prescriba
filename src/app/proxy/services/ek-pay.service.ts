import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { EkPayInitDto } from '../dto-models/models';
import type { EkPayInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class EkPayService {
  apiName = 'Default';
  

  initiatePayment = (input: EkPayInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EkPayInitDto>({
      method: 'POST',
      url: '/api/app/ek-pay/initiate-payment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiateTestPayment = (input: EkPayInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EkPayInitDto>({
      method: 'POST',
      url: '/api/app/ek-pay/initiate-test-payment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiateTestRefund = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/ek-pay/initiate-test-refund',
    },
    { apiName: this.apiName,...config });
  

  updateApplicantPaymentStatusByEkPayResponseDic = (ekPayResponseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/ek-pay/applicant-payment-status',
      body: ekPayResponseDic,
    },
    { apiName: this.apiName,...config });
  

  updateAppointmentPaymentStatus = (appCode: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/ek-pay/appointment-payment-status',
      params: { appCode },
    },
    { apiName: this.apiName,...config });
  

  updatePaymentHistoryByEkPayResponseDic = (ekPayResponseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/ek-pay/payment-history',
      body: ekPayResponseDic,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
