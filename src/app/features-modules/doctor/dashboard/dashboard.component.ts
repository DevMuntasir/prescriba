import { Component, OnInit, inject } from '@angular/core';
import { DoctorProfileDto } from 'src/app/api/dto-models';
import { DoctorProfileInputDto } from 'src/app/api/input-dto';
import { DoctorProfileService } from 'src/app/api/services';
import { TosterService } from 'src/app/shared/services/toster.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private userStateService = inject(UserinfoStateService);
  private doctorProfileService = inject(DoctorProfileService);
  private toaster = inject(TosterService);

  authenticatedUserDetails: DoctorProfileDto = {} as DoctorProfileDto;
  showProfileOnboarding = false;
  savingProfile = false;

  ngOnInit(): void {
    this.userStateService.authenticateUserInfo.subscribe((res) => {
      if (res) {
        this.authenticatedUserDetails = res;
        this.evaluateOnboardingState(res);
      }
    });
  }

  handleProfileCompletion(updatedProfile: DoctorProfileInputDto): void {
    this.savingProfile = true;
    this.doctorProfileService.updateDoctorProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.savingProfile = false;
        this.showProfileOnboarding = this.shouldPromptForOnboarding(profile);
        this.authenticatedUserDetails = profile;
        this.userStateService.sendData(profile);
        this.toaster.customToast('Profile updated successfully', 'success');
      },
      error: (error) => {
        this.savingProfile = false;
        this.toaster.customToast(
          error?.message ?? 'Unable to update profile, please try again.',
          'error'
        );
      },
    });
  }

  private evaluateOnboardingState(profile: DoctorProfileDto): void {
    if (!profile?.id) {
      this.showProfileOnboarding = false;
      return;
    }
    this.showProfileOnboarding = this.shouldPromptForOnboarding(profile);
  }

  private shouldPromptForOnboarding(profile: DoctorProfileDto): boolean {
    if (!profile) {
      return true;
    }

    const requiredFields: (keyof DoctorProfileDto)[] = [
      'bmdcRegNo',
      'bmdcRegExpiryDate',
      'address',
      'city',
      'zipCode',
      'country',
      'identityNumber',
      'specialityName',
    ];

    const hasMissingBasics = requiredFields.some((field) => {
      const value = profile[field];
      return value === undefined || value === null || value === '';
    });

    const hasDegrees = Array.isArray(profile.degrees) && profile.degrees.length > 0;
    const hasSpecializations =
      Array.isArray(profile.doctorSpecialization) &&
      profile.doctorSpecialization.length > 0;

    const isProfileStepCompleted = (profile.profileStep ?? 0) >= 4;

    return hasMissingBasics || !hasDegrees || !hasSpecializations || !isProfileStepCompleted;
  }
}
