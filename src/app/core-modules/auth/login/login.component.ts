import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import { USER_SECRATE } from 'src/environments/environment';
import { TosterService } from 'src/app/shared/services/toster.service';
import { UserManageAccountsService } from '../auth-service/user-manage-accounts.service';
import { DoctorProfileService } from 'src/app/api/services';
import { AuthService as AuthApiService } from '../auth-service/auth.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from '@angular/fire/auth';
import { LoginResponseDto, PatientProfileDto } from 'src/app/api/dto-models';
import { UserSignInRequestDto } from 'src/app/api/soow-good/domain/service/models/user-info';

export interface ExtendedLoginDto {
  userName: string;
  password: string;
  otp: string;
}

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
  loginForm!: FormGroup;
  formSubmitted = false;
  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';
  btnLoading = false;
  googleAuthLoading = false;
  key: string = USER_SECRATE;

  otp = signal<Otp>({
    pin: 0,
    showOtp: false,
    isLoading: false,
    otpError: '',
    otpSuccess: '',
  });

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private normalAuth = inject(AuthService);
  private userManageAccountsService = inject(UserManageAccountsService);
  private toasterService = inject(TosterService);
  private authApi = inject(AuthApiService);
  private doctorProfileService = inject(DoctorProfileService);
  private dialog = inject(MatDialog);
  private firebaseAuth = inject(Auth); // ✅ Firebase modular inject

  ngOnInit(): void {
    this.initForm();
  }

  /** 🔹 Google Sign-In */
  async signInWithGoogle(): Promise<void> {
    if (this.googleAuthLoading) return;
    this.googleAuthLoading = true;

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(this.firebaseAuth, provider);
      const user = credential.user;
console.log(user);

      if (!user) throw new Error('Google authentication failed.');

      const idToken = await user.getIdToken();

      const authInfo = {
        fullName: user.displayName || user.email || 'Google User',
        name: user.displayName || 'Google User',
        userId: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        userType: 'doctor',
        password: 'Coppa@123',
      };
// email
// : 
// "user.@soowgood.com"
// name
// : 
// "Muntasir Udoy"
// password
// : 
// "Coppa@123"
// phoneNumber
// : 
// "01877332323"
// roleId
// : 
// "Doctor"
// surname
// : 
// "default"
// userName
// : 
// "01877332323"




      this.normalAuth.setAuthInfoInLocalStorage(authInfo);
      localStorage.setItem('access', JSON.stringify(idToken));
      localStorage.setItem('refreshToken', JSON.stringify(user.refreshToken));

      this.router.navigate(['/doctor/dashboard']);
      this.toasterService.customToast('Signed in with Google successfully.', 'success');
    } catch (error: any) {
      const message =
        error?.message || 'Unable to complete Google sign-in. Please try again.';
      this.toasterService.customToast(message, 'error');
    } finally {
      this.googleAuthLoading = false;
    }
  }

  /** 🔹 Login Form */
  initForm() {
    this.loginForm = this.fb.group({
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  /** 🔹 Regular Login */
  onSubmit(): void {
    this.formSubmitted = true;
    this.otp.update((p) => ({ ...p, otpError: '' }));

    if (this.loginForm.invalid) return;

    const requestLogin: UserSignInRequestDto = {
      userName: this.loginForm.get('mobileNo')?.value,
      password: this.formControl['password'].value,
      userLoginType: 2,
    };

    this.btnLoading = true;
    this.authApi.loginApiByRequest(requestLogin).subscribe({
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
        this.toasterService.customToast(errorMessage, 'error');
      },
    });
  }

  /** 🔹 Handle Doctor Profile after successful login */
  handleDoctorProfile(userInfo: LoginResponseDto) {
    return
    // if (userInfo.userName || userInfo.userEmail) {
    //   const fetchProfile$ = userInfo.userName
    //   ? this.doctorProfileService.getByUserName(userInfo.userName)
    //   : this.doctorProfileService.getByUserEmail(userInfo.email);
    //  fetchProfile$.subscribe({
    //     next: (patientDto: PatientProfileDto) => {
    //       const saveLocalStorage = {
    //         fullName: patientDto.fullName,
    //         userId: patientDto.userId,
    //         id: patientDto.id,
    //         userType: userInfo.roleName[0].toLowerCase(),
    //       };
    //       this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);

    //       localStorage.setItem('access', JSON.stringify(userInfo.accessToken));
    //       localStorage.setItem(
    //         'refreshToken',
    //         JSON.stringify(userInfo.refreshToken)
    //       );
    //       const userType = userInfo.roleName[0].toLowerCase() + '/dashboard';
    //       this.router.navigate([userType.toLowerCase()], {
    //         state: { data: patientDto },
    //       });
    //       this.btnLoading = false;
    //       this.otp.update((p) => ({ ...p, isLoading: false }));
    //       this.normalAuth.setOtpLoader(false);
    //     },
    //     error: (err: any) => {
    //       console.error(err);
    //       this.btnLoading = false;
    //     },
    //   });
    // } else {
    //   this.btnLoading = false;
    //   this.otp.update((p) => ({ ...p, isLoading: false }));
    //   this.toasterService.customToast('Username not found!', 'error');
    // }
  }

  /** 🔹 Password Visibility Toggle */
  passwordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password'], {
      queryParams: { redirect: 'login' },
    });
  }

  updateQueryParam(userType: string) {
    const queryParams =
      userType !== '' ? { userType: userType } : { userType: null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  backToPrevious() {
    this.updateQueryParam('');
  }
}
