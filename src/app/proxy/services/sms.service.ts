import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SmsRequestParamDto, SmsResponseDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  apiName = 'Default';
  

  sendSmsGreenWebByInput = (input: SmsRequestParamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SmsResponseDto>({
      method: 'POST',
      url: '/api/app/sms/send-sms-green-web',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendSmsNotificationByInput = (input: SmsRequestParamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SmsResponseDto>({
      method: 'POST',
      url: '/api/app/sms/send-sms-notification',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
