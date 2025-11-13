import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from 'src/app/api/core/generic-models';
import { LoginResponseDto } from 'src/app/api/dto-models';
import {
  RefreshTokenInput,
  VerifyAccessTokenInput,
} from 'src/app/api/input-dto';
import { UserSignInRequestDto } from 'src/app/api/soow-good/domain/service/models/user-info';
import { authenticationApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authBaseUrl = `${authenticationApi}/api/app/auth`;

  constructor(private http: HttpClient) {}

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
