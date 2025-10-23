import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import { ApiResponse } from '../core/generic-models';
import type { Response } from '../core/service/generic-models';
import type {
  OtpResultDto,
  ResetPasswordInputDto,
  ResetPasswordResponseDto,
  ResetPasswordRoleWiseInputDto,
  SendOtpResponseDto,
  UserSignUpResultDto,
} from '../dto-models/models';
import type { OtpRequestDto } from '../soow-good/domain/service/models/otp/models';
import type {
  SaveSendOtpModel,
  SendOtpModel,
  UserSignInReturnDto,
  UserSingupRequestDto,
} from '../soow-good/domain/service/models/user-info/models';

@Injectable({ providedIn: 'root' })
export class UserManageAccountsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  checkUserExistByUserName(
    mobileNo: string
  ): Observable<ApiResponse<UserSignUpResultDto>> {
    const params = new HttpParams().set('mobileNo', mobileNo);

    return this.http.post<ApiResponse<UserSignUpResultDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/check-user-exist-by-user-name`,
      null,
      { params }
    );
  }

  getUserRoles(userId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/api/app/user-manage-accounts/user-roles/${userId}`
    );
  }

  resetPassword(
    inputDto: ResetPasswordInputDto
  ): Observable<ApiResponse<ResetPasswordResponseDto>> {
    return this.http.post<ApiResponse<ResetPasswordResponseDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/reset-password`,
      inputDto
    );
  }

  saveOtpForVerifyUserLater(
    request: SaveSendOtpModel
  ): Observable<Response<OtpResultDto>> {
    return this.http.post<Response<OtpResultDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/save-otp-for-verify-user-later`,
      request
    );
  }

  sendOtp(request: SendOtpModel): Observable<ApiResponse<SendOtpResponseDto>> {
    return this.http.post<ApiResponse<SendOtpResponseDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/send-otp`,
      request
    );
  }

  signupUser(
    request: UserSingupRequestDto
  ): Observable<ApiResponse<UserSignUpResultDto>> {
    return this.http.post<ApiResponse<UserSignUpResultDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/signup-user`,
      request
    );
  }

  userPasswordChangesScript(
    inputDto: ResetPasswordRoleWiseInputDto
  ): Observable<ApiResponse<ResetPasswordResponseDto>> {
    return this.http.post<ApiResponse<ResetPasswordResponseDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/user-password-changes-script`,
      inputDto
    );
  }

  verifyOtp(
    request: OtpRequestDto
  ): Observable<ApiResponse<UserSignInReturnDto>> {
    return this.http.post<ApiResponse<UserSignInReturnDto>>(
      `${this.baseUrl}/api/app/user-manage-accounts/verify-otp`,
      request
    );
  }
}
