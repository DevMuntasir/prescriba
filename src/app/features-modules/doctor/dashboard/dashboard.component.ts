import { Component, inject, OnInit } from '@angular/core';
import {
  DoctorProfileDto
} from 'src/app/api/dto-models';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { MockOnboardingService } from 'src/app/shared/services/mock-onboarding.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private UserService = inject(UserinfoStateService);
  private onboardingService = inject(MockOnboardingService);
  authenticatedUserDetails: DoctorProfileDto = {} as DoctorProfileDto;
  showProfileOnboarding = false;
  savingProfile = false;
  ngOnInit(): void {
    this.UserService.authenticateUserInfo.subscribe((res) => {
      if (res) {
        this.authenticatedUserDetails = res;
        this.evaluateOnboardingState(res);
      }
    });
  }

  handleProfileCompletion(updatedProfile: DoctorProfileDto): void {
    this.savingProfile = true;
    this.onboardingService.completeProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.savingProfile = false;
        this.showProfileOnboarding = false;
        this.authenticatedUserDetails = profile;
        this.UserService.sendData(profile);
      },
      error: () => {
        this.savingProfile = false;
      },
    });
  }

  private evaluateOnboardingState(profile: DoctorProfileDto): void {
    const profileId = profile?.id ?? null;
    if (!profileId) {
      this.showProfileOnboarding = false;
      return;
    }
    this.showProfileOnboarding = this.onboardingService.shouldShowOnboarding(profileId);
  }
}
