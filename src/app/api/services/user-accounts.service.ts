import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type {
  AccountDeteleResponsesDto,
  DeleteUserDataDto,
  JAccessToken,
  LoginDto,
  LoginResponseDto,
  PatientDetailsForServiceDto,
  ResetPasswordInputDto,
  ResetPasswordResponseDto,
  UserInfoDto,
  UserSignUpResultDto,
} from '../dto-models/models';
import type { IdentityUser } from '../volo/abp/identity/models';

@Injectable({ providedIn: 'root' })
export class UserAccountsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  decodeJwt(jwt: JAccessToken): Observable<PatientDetailsForServiceDto> {
    return this.http.post<PatientDetailsForServiceDto>(
      `${this.baseUrl}/api/app/user-accounts/decode-jwt`,
      jwt
    );
  }

  isUserExists(userName: string): Observable<boolean> {
    const params = new HttpParams().set('userName', userName);

    return this.http.post<boolean>(
      `${this.baseUrl}/api/app/user-accounts/is-user-exists`,
      null,
      { params }
    );
  }

  login(userDto: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${this.baseUrl}/api/app/user-accounts/login`,
      userDto
    );
  }

  refreshAccessToken(user: IdentityUser): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/api/app/user-accounts/refresh-access-token`,
      user
    );
  }

  resetPassword(
    inputDto: ResetPasswordInputDto
  ): Observable<ResetPasswordResponseDto> {
    return this.http.post<ResetPasswordResponseDto>(
      `${this.baseUrl}/api/app/user-accounts/reset-password`,
      inputDto
    );
  }

  resetPasswordApp(
    inputDto: ResetPasswordInputDto
  ): Observable<ResetPasswordResponseDto> {
    return this.http.post<ResetPasswordResponseDto>(
      `${this.baseUrl}/api/app/user-accounts/reset-password_App`,
      inputDto
    );
  }

  signupUser(
    userDto: UserInfoDto,
    password: string,
    role: string
  ): Observable<UserSignUpResultDto> {
    const params = new HttpParams()
      .set('password', password)
      .set('role', role);

    return this.http.post<UserSignUpResultDto>(
      `${this.baseUrl}/api/app/user-accounts/signup-user`,
      userDto,
      { params }
    );
  }

  userDataRemove(
    userData: DeleteUserDataDto,
    role: string
  ): Observable<AccountDeteleResponsesDto> {
    const params = new HttpParams().set('role', role);

    return this.http.post<AccountDeteleResponsesDto>(
      `${this.baseUrl}/api/app/user-accounts/user-data-remove`,
      userData,
      { params }
    );
  }
}
