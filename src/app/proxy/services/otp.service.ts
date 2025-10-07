import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { OtpDto, OtpResultDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  apiName = 'Default';
  

  applyOtpByClientKeyAndMobileNo = (clientKey: string, mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/apply-otp',
      params: { clientKey, mobileNo },
    },
    { apiName: this.apiName,...config });
  

  applyOtpForPasswordResetByClientKeyAndRoleAndMobileNo = (clientKey: string, role: string, mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/apply-otp-for-password-reset',
      params: { clientKey, role, mobileNo },
    },
    { apiName: this.apiName,...config });
  

  checkUserExistsByMobileNo = (mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/check-user-exists',
      params: { mobileNo },
    },
    { apiName: this.apiName,...config });
  

  isAgentExistByMobile = (mobile: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/is-agent-exist',
      params: { mobile },
    },
    { apiName: this.apiName,...config });
  

  isDoctorExistByMobile = (mobile: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/is-doctor-exist',
      params: { mobile },
    },
    { apiName: this.apiName,...config });
  

  isExistByMobile = (mobile: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/is-exist',
      params: { mobile },
    },
    { apiName: this.apiName,...config });
  

  isPatientExistByMobile = (mobile: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/is-patient-exist',
      params: { mobile },
    },
    { apiName: this.apiName,...config });
  

  sendOtpByClientKeyAndMobileNo = (clientKey: string, mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OtpResultDto>({
      method: 'POST',
      url: '/api/app/otp/send-otp',
      params: { clientKey, mobileNo },
    },
    { apiName: this.apiName,...config });
  

  sendOtpWebByClientKeyAndMobileNo = (clientKey: string, mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/send-otp-web',
      params: { clientKey, mobileNo },
    },
    { apiName: this.apiName,...config });
  

  sendWebOtpByClientKeyAndMobileNo = (clientKey: string, mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/send-web-otp',
      params: { clientKey, mobileNo },
    },
    { apiName: this.apiName,...config });
  

  update = (input: OtpDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OtpDto>({
      method: 'PUT',
      url: '/api/app/otp',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  varifyOtp = (otp: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/otp/varify-otp',
      params: { otp },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
