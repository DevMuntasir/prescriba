import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../core/generic-models';
import type { LoginResponseDto } from '../dto-models/models';
import type { RefreshTokenInput, VerifyAccessTokenInput } from '../input-dto/models';
import type { UserSignInRequestDto } from '../soow-good/domain/service/models/user-info/models';
import { authenticationApi } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authBaseUrl = `${authenticationApi}/api/app/auth`;

  loginApiByRequest(
    request: UserSignInRequestDto
  ): Observable<ApiResponse<LoginResponseDto>> {
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.authBaseUrl}/login-api`,
      request
    );
  }

  refreshTokenByInput(
    input: RefreshTokenInput
  ): Observable<ApiResponse<LoginResponseDto>> {
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.authBaseUrl}/refresh-token`,
      input
    );
  }

  verifyAccessTokenByInput(
    input: VerifyAccessTokenInput
  ): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.authBaseUrl}/verify-access-token`,
      input
    );
  }
}
