import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PaymentHistoryDto, SslCommerzInitDto, TransactionValidationDto } from '../dto-models/models';
import type { PaymentHistoryMobileInputDto, SslCommerzInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class SslCommerzService {
  apiName = 'Default';
  

  initPaymentHistoryFromMobileByInput = (input: PaymentHistoryMobileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentHistoryDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/init-payment-history-from-mobile',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiatePackagePayment = (input: SslCommerzInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SslCommerzInitDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/initiate-package-payment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiatePayment = (input: SslCommerzInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SslCommerzInitDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/initiate-payment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiateRefund = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/ssl-commerz/initiate-refund',
    },
    { apiName: this.apiName,...config });
  

  initiateTestPayment = (input: SslCommerzInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SslCommerzInitDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/initiate-test-payment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  initiateTestRefund = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/ssl-commerz/initiate-test-refund',
    },
    { apiName: this.apiName,...config });
  

  updateApplicantPaymentStatusBySslCommerzResponseDic = (sslCommerzResponseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/ssl-commerz/applicant-payment-status',
      body: sslCommerzResponseDic,
    },
    { apiName: this.apiName,...config });
  

  updateAppointmentPaymentStatus = (appCode: string, sts: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'PUT',
      responseType: 'text',
      url: '/api/app/ssl-commerz/appointment-payment-status',
      params: { appCode, sts },
    },
    { apiName: this.apiName,...config });
  

  updatePaymentHistoryBySslCommerzResponseDic = (sslCommerzResponseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/ssl-commerz/payment-history',
      body: sslCommerzResponseDic,
    },
    { apiName: this.apiName,...config });
  

  validateTestTransaction = (responseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TransactionValidationDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/validate-test-transaction',
      body: responseDic,
    },
    { apiName: this.apiName,...config });
  

  validateTransaction = (responseDic: Record<string, string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TransactionValidationDto>({
      method: 'POST',
      url: '/api/app/ssl-commerz/validate-transaction',
      body: responseDic,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
