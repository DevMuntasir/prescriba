import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/api/core/generic-models';
import {
  ResetPasswordInputDto,
  ResetPasswordResponseDto,
  SendOtpResponseDto,
  UserSignUpResultDto,
} from 'src/app/api/dto-models';
import { OtpRequestDto } from 'src/app/api/soow-good/domain/service/models/otp';
import {
  OrganizationValidateRequestDto,
  OrganizationValidityDto,
  SendOtpModel,
  UserSignInReturnDto,
  UserSingupRequestDto,
} from 'src/app/api/soow-good/domain/service/models/user-info';
import { authenticationApi, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManageAccountsService {
  private baseUrl = `${authenticationApi}/api/app/user-manage-accounts`;
  private mainBaseUrl = `${environment.apis.default.url}/api/app/user-manage-accounts`;

  constructor(private http: HttpClient) {}

  checkUserExistByUserNameByMobileNo(
    mobileNo: string
  ): Observable<ApiResponse<UserSignUpResultDto>> {
    return this.http.post<ApiResponse<UserSignUpResultDto>>(
      `${this.baseUrl}/check-user-exist-by-user-name?mobileNo=${mobileNo}`,
      {}
    );
  }

  getUserRoles(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user-roles/${userId}`);
  }

  resetPasswordByInputDto(
    inputDto: ResetPasswordInputDto
  ): Observable<ApiResponse<ResetPasswordResponseDto>> {
    return this.http.post<ApiResponse<ResetPasswordResponseDto>>(
      `${this.baseUrl}/reset-password`,
      inputDto
    );
  }

  sendOtpByRequest(
    request: SendOtpModel
  ): Observable<ApiResponse<SendOtpResponseDto>> {
    return this.http.post<ApiResponse<SendOtpResponseDto>>(
      `${this.baseUrl}/send-otp`,
      request
    );
  }

  signupUserByRequest(
    request: UserSingupRequestDto
  ): Observable<ApiResponse<UserSignUpResultDto>> {
    return this.http.post<ApiResponse<UserSignUpResultDto>>(
      `${this.baseUrl}/signup-user`,
      request
    );
  }

  verifyOtpByRequest(
    request: OtpRequestDto
  ): Observable<ApiResponse<UserSignInReturnDto>> {
    return this.http.post<ApiResponse<UserSignInReturnDto>>(
      `${this.baseUrl}/verify-otp`,
      request
    );
  }

  validateOrganizationById(
    request: OrganizationValidateRequestDto
  ): Observable<ApiResponse<OrganizationValidityDto>> {
    return this.http.post<ApiResponse<OrganizationValidityDto>>(
      `${this.mainBaseUrl}/validate-origanization-by-id?organizationId=${request.organizationId}&userId=${request.userId}`,
      null
    );
  }
}
