import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { Response } from '../core/service/generic-models/models';
import type { OtpResultDto, ResetPasswordInputDto, ResetPasswordResponseDto, ResetPasswordRoleWiseInputDto, SendOtpResponseDto, UserSignUpResultDto } from '../dto-models/models';
import type { OtpRequestDto } from '../soow-good/domain/service/models/otp/models';
import type { SaveSendOtpModel, SendOtpModel, UserSignInReturnDto, UserSingupRequestDto } from '../soow-good/domain/service/models/user-info/models';

@Injectable({
  providedIn: 'root',
})
export class UserManageAccountsService {
  apiName = 'Default';
  

  checkUserExistByUserNameByMobileNo = (mobileNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<UserSignUpResultDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/check-user-exist-by-user-name',
      params: { mobileNo },
    },
    { apiName: this.apiName,...config });
  

  getUserRoles = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: `/api/app/user-manage-accounts/user-roles/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  resetPasswordByInputDto = (inputDto: ResetPasswordInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<ResetPasswordResponseDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/reset-password',
      body: inputDto,
    },
    { apiName: this.apiName,...config });
  

  saveOtpForVerifyUserLaterByRequest = (request: SaveSendOtpModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Response<OtpResultDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/save-otp-for-verify-user-later',
      body: request,
    },
    { apiName: this.apiName,...config });
  

  sendOtpByRequest = (request: SendOtpModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<SendOtpResponseDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/send-otp',
      body: request,
    },
    { apiName: this.apiName,...config });
  

  signupUserByRequest = (request: UserSingupRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<UserSignUpResultDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/signup-user',
      body: request,
    },
    { apiName: this.apiName,...config });
  

  userPasswordChangesScriptByInputDto = (inputDto: ResetPasswordRoleWiseInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<ResetPasswordResponseDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/user-password-changes-script',
      body: inputDto,
    },
    { apiName: this.apiName,...config });
  

  verifyOtpByRequest = (request: OtpRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<UserSignInReturnDto>>({
      method: 'POST',
      url: '/api/app/user-manage-accounts/verify-otp',
      body: request,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
