import { Component, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import * as CryptoJS from 'crypto-js';

import { USER_SECRATE } from 'src/environments/environment';
// import { SubSink } from 'subsink';

import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import { LoginResponseDto, PatientProfileDto } from 'src/app/proxy/dto-models';
import { OtpRequestDto } from 'src/app/proxy/soow-good/domain/service/models/otp';
import {
  SendOtpModel,
  UserSignInRequestDto,
} from 'src/app/proxy/soow-good/domain/service/models/user-info';
import { TosterService } from 'src/app/shared/services/toster.service';
import { UserManageAccountsService } from '../auth-service/user-manage-accounts.service';
import { DoctorProfileService } from 'src/app/proxy/services';
import { AuthService as Auth } from '../auth-service/auth.service';
import { AuthService } from 'src/app/shared/services/auth.service';

// import { DoctorProfileDto, PatientProfileDto } from 'src/app/proxy/dto-models';
export interface ExtendedLoginDto {
  userName: string;
  password: string;
  otp: string;
}

const loginDto: ExtendedLoginDto = {
  userName: '',
  password: '',
  otp: '',
};

type Otp = {
  pin: number;
  showOtp: boolean;
  isLoading: boolean;
  otpError: string | undefined;
  otpSuccess: string | undefined;
};
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgOtpInputModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @Input() navigateURL = '';
  formSubmitted = false;
  // errorMessage: string = '';
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  returnUrl!: string; //(for redirect next js application)
  // isLoading: any = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  key: string = USER_SECRATE; //next js application

  otp = signal<Otp>({
    pin: 0,
    showOtp: false,
    isLoading: false,
    otpError: '',
    otpSuccess: '',
  });
  btnLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private NormalAuth: AuthService,
    private UserManageAccountsService: UserManageAccountsService,
    private TosterService: TosterService,
    private Auth: Auth,
    private DoctorProfileService: DoctorProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  get formControl() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  goToForgotPassword() {
    this.Router.navigate(['/forgot-password'], {
      queryParams: { redirect: 'login' },
    });
  }

  passwordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.otp.update((p) => ({
      ...p,
      otpError: '',
    }));

    if (this.loginForm.invalid) {
      return;
    }

    const requestLogin: UserSignInRequestDto = {
      userName: this.loginForm.get('mobileNo')?.value,
      password: this.formControl['password'].value,
      userLoginType: 2,
    };

    try {
      this.btnLoading = true;
      this.Auth.loginApiByRequest(requestLogin).subscribe({
        next: (userInfo) => {
          if (
            userInfo.is_success &&
            userInfo.results.roleName[0].toLowerCase() !== 'doctor'
          ) {
            this.otp.update((p) => ({
              ...p,
              isLoading: false,
              otpError: 'You are not authenticated for the doctor portal',
            }));
            this.btnLoading = false;
            return;
          }

          if (userInfo.is_success) {
            this.handleDoctorProfile(userInfo.results);
            return;
          }

          this.otp.update((p) => ({
            ...p,
            isLoading: false,
            otpError: userInfo.message,
          }));
          this.btnLoading = false;
        },
        error: (errorResponse) => {
          const errorMessage =
            errorResponse.error.error_description ||
            errorResponse.error.message;
          this.btnLoading = false;
          this.TosterService.customToast(errorMessage, 'error');
        },
      });
    } catch (error: any) {
      console.log(error);

      this.btnLoading = false;
      this.TosterService.customToast(error, 'error');
    }
  }

  handleDoctorProfile(userInfo: LoginResponseDto) {
    if (userInfo.userName) {
      this.DoctorProfileService.getByUserName(userInfo.userName).subscribe({
        next: (patientDto: PatientProfileDto) => {
          let saveLocalStorage = {
            fullName: patientDto.fullName,
            userId: patientDto.userId,
            id: patientDto.id,
            userType: userInfo.roleName[0].toLowerCase(),
          };
          this.NormalAuth.setAuthInfoInLocalStorage(saveLocalStorage);

          localStorage.setItem('access', JSON.stringify(userInfo.accessToken));
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(userInfo.refreshToken)
          );
          const userType = userInfo.roleName[0].toLowerCase() + '/dashboard';
          this.Router.navigate([userType.toLowerCase()], {
            state: { data: patientDto },
          });
          this.btnLoading = false;
          this.otp.update((p) => ({
            ...p,
            isLoading: false,
          }));
          this.NormalAuth.setOtpLoader(false);
        },
        error: (patientError: any) => {
          console.log(patientError);
          this.btnLoading = false;
        },
      });
    } else {
      this.btnLoading = false;
      this.otp.update((p) => ({
        ...p,
        isLoading: false,
      }));
      this.TosterService.customToast('Username not found!', 'error');
    }
  }

  updateQueryParam(userType: string) {
    const queryParams =
      userType !== '' ? { userType: userType } : { userType: null };
    this.Router.navigate([], {
      relativeTo: this.ActivatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  backToPrevious() {
    this.updateQueryParam('');
  }
}
