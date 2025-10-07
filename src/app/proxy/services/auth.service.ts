import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../core/generic-models/models';
import type { LoginResponseDto } from '../dto-models/models';
import type { RefreshTokenInput, VerifyAccessTokenInput } from '../input-dto/models';
import type { UserSignInRequestDto } from '../soow-good/domain/service/models/user-info/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiName = 'Default';
  

  loginApiByRequest = (request: UserSignInRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<LoginResponseDto>>({
      method: 'POST',
      url: '/api/app/auth/login-api',
      body: request,
    },
    { apiName: this.apiName,...config });
  

  refreshTokenByInput = (input: RefreshTokenInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<LoginResponseDto>>({
      method: 'POST',
      url: '/api/app/auth/refresh-token',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  verifyAccessTokenByInput = (input: VerifyAccessTokenInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponse<boolean>>({
      method: 'POST',
      url: '/api/app/auth/verify-access-token',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
