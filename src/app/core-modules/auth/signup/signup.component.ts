import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MockOnboardingService } from 'src/app/shared/services/mock-onboarding.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
@Component({
  selector: 'app-signup-component',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
})
export class SignupComponent implements OnInit {
  formGroup!: FormGroup;
  loading = signal(false);
  submitAttempted = false;
  submitError = signal('');

  private passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authStorage: AuthService,
    private onboardingService: MockOnboardingService,
    private userInfoState: UserinfoStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  get controls() {
    return this.formGroup.controls;
  }

  initializeForm(): void {
    this.formGroup = this.fb.group(
      {
        mobileNo: [
          '',
          [
            Validators.required,
            Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.formGroup.markAllAsTouched();
    this.submitError.set('');

    if (this.loading() || this.formGroup.invalid) {
      return;
    }

    const { mobileNo, password } = this.formGroup.value;
    this.loading.set(true);

    this.onboardingService.signup({ mobileNo, password }).subscribe({
      next: (profile) => {
        const authPayload = {
          fullName: profile.fullName ?? 'Doctor',
          userId: profile.userId,
          id: profile.id,
          userType: 'doctor',
        };

        this.authStorage.setAuthInfoInLocalStorage(authPayload);
        this.userInfoState.sendData(profile);
        this.loading.set(false);
        this.router.navigate(['/doctor/dashboard'], {
          state: { onboarding: true },
        });
      },
      error: (error) => {
        console.error('Mock signup failed', error);
        this.submitError.set('Unable to complete signup. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
