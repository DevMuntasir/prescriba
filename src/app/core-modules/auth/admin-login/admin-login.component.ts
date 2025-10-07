import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ApiResponse } from 'src/app/proxy/core/generic-models';
import { LoginResponseDto } from 'src/app/proxy/dto-models';
import { UserSignInRequestDto } from 'src/app/proxy/soow-good/domain/service/models/user-info';
import { AuthService as SessionAuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { AuthService as AuthApiService } from '../../../proxy/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent implements OnDestroy {
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  formSubmitted = false;
  submitting = false;
  showPassword = false;
  statusMessage = signal<string | null>(null);
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authApi: AuthApiService,
    private readonly sessionAuth: SessionAuthService,
    private readonly toaster: TosterService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.formSubmitted = true;
    this.statusMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const request: UserSignInRequestDto = {
      userName: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    const loginSub = this.authApi
      .loginApiByRequest(request)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response: ApiResponse<LoginResponseDto>) => {
          const isAdmin = response.results?.roleName?.some(
            (role) => role?.toLowerCase() === 'admin'
          );

          if (response.is_success && isAdmin) {
            this.persistAdminSession(response.results);
            this.toaster.customToast('Signed in successfully.', 'success');
            this.statusMessage.set('Admin access granted.');
            return;
          }

          this.statusMessage.set('Admin credentials not recognised.');
          this.toaster.customToast(
            response.message || 'You are not authorised to access the admin console.',
            'error'
          );
          this.form.get('password')?.reset();
        },
        error: (errorResponse) => {
          const errorMessage =
            errorResponse?.error?.error_description ||
            errorResponse?.error?.message ||
            'Unable to sign in. Please try again.';

          this.statusMessage.set(errorMessage);
          this.toaster.customToast(errorMessage, 'error');
        },
      });

    this.subscriptions.add(loginSub);
  }

  hasError(controlName: 'email' | 'password'): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }

  private persistAdminSession(loginInfo: LoginResponseDto | undefined): void {
    if (!loginInfo) {
      return;
    }

    const adminSession = {
      fullName: loginInfo.userName || 'Administrator',
      userId: loginInfo.userId,
      id: '000',
      userType: 'admin',
      accessToken: loginInfo.accessToken,
      refreshToken: loginInfo.refreshToken,
    };

    this.sessionAuth.setAuthInfoInLocalStorage(adminSession);

    if (loginInfo.accessToken) {
      localStorage.setItem('access', JSON.stringify(loginInfo.accessToken));
    }

    if (loginInfo.refreshToken) {
      localStorage.setItem('refreshToken', JSON.stringify(loginInfo.refreshToken));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
