import { Component, OnInit, inject } from '@angular/core';
import {
  DoctorDegreeDto,
  DoctorProfileDto,
  DoctorSpecializationDto,
} from 'src/app/api/dto-models';
import {
  DoctorDegreeInputDto,
  DoctorProfileInputDto,
  DoctorSpecializationInputDto,
} from 'src/app/api/input-dto';
import {
  DoctorDegreeService,
  DoctorProfileService,
  DoctorSpecializationService,
  DoctorChamberService,
  DoctorScheduleService,
} from 'src/app/api/services';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
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
  private doctorDegreeService = inject(DoctorDegreeService);
  private doctorSpecializationService = inject(DoctorSpecializationService);
  private doctorChamberService = inject(DoctorChamberService);
  private doctorScheduleService = inject(DoctorScheduleService);
  private toaster = inject(TosterService);

  authenticatedUserDetails: DoctorProfileDto = {} as DoctorProfileDto;
  showProfileOnboarding = false;
  savingProfile = false;
  isInitialLoading = true;

  // Temporary storage for chambers and schedules from onboarding
  private pendingChambers: any[] = [];
  private pendingSchedules: any[] = [];

  ngOnInit(): void {
    this.userStateService.authenticateUserInfo.subscribe((res) => {
      if (!res?.id) {
        return;
      }

      this.authenticatedUserDetails = res;
      this.evaluateOnboardingState(res);
      this.showProfileOnboarding = this.shouldPromptForOnboarding(res)
      console.log(this.shouldPromptForOnboarding(res));
      console.log(res);
      this.isInitialLoading = false;
    });
  }

  handleProfileCompletion(updatedProfile: DoctorProfileInputDto): void {
    if (!this.authenticatedUserDetails?.id) {
      this.toaster.customToast(
        'Unable to update profile because the doctor id is missing.',
        'error'
      );
      return;
    }

    const profileId = this.authenticatedUserDetails.id;
    const existingDegrees = this.authenticatedUserDetails.degrees ?? [];
    const existingSpecializations =
      this.authenticatedUserDetails.doctorSpecialization ?? [];

    const {
      degrees = [],
      doctorSpecialization = [],
      ...basicProfile
    } = updatedProfile;

    const basicInfoPayload: DoctorProfileInputDto = {
      ...basicProfile,
      id: profileId,
      degrees: existingDegrees as DoctorDegreeInputDto[],
      doctorSpecialization:
        existingSpecializations as DoctorSpecializationInputDto[],
    };

    this.savingProfile = true;
    this.doctorProfileService
      .updateDoctorProfile(basicInfoPayload)
      .pipe(
        switchMap((profile) => {
          const updatedProfileId = profile.id ?? profileId;
          return forkJoin([
            this.syncDegrees(updatedProfileId, degrees, existingDegrees),
            this.syncSpecializations(
              updatedProfileId,
              doctorSpecialization,
              existingSpecializations
            ),
          ]).pipe(map(() => updatedProfileId));
        }),
        switchMap((id) => {
          // Create chambers and schedules if they exist
          const requests: Observable<unknown>[] = [];

          if (this.pendingChambers.length > 0) {
            this.pendingChambers.forEach(chamber => {
              requests.push(this.doctorChamberService.create({
                ...chamber,
                doctorProfileId: id
              }));
            });
          }

          if (this.pendingSchedules.length > 0) {
            // We need to wait for chambers to be created first to get their IDs
            // For now, we'll skip schedule creation in onboarding
            // Schedules require chamber IDs which we don't have yet
          }

          return requests.length > 0
            ? forkJoin(requests).pipe(map(() => id))
            : of(id);
        }),
        switchMap((id) => this.doctorProfileService.get(id))
      )
      .subscribe({
        next: (profile) => {
          this.savingProfile = false;
          this.showProfileOnboarding = this.shouldPromptForOnboarding(profile);
          console.log(this.shouldPromptForOnboarding(profile));

          this.authenticatedUserDetails = profile;
          this.userStateService.sendData(profile);

          // Clear pending data
          this.pendingChambers = [];
          this.pendingSchedules = [];

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

  handleChambersCreation(chambers: any[]): void {
    this.pendingChambers = chambers;
  }

  handleSchedulesCreation(schedules: any[]): void {
    this.pendingSchedules = schedules;
  }

  private syncDegrees(
    doctorProfileId: number,
    nextDegrees: DoctorDegreeInputDto[] = [],
    existingDegrees: DoctorDegreeDto[] = []
  ): Observable<void> {
    const normalizedUpdates = (nextDegrees ?? []).map((degree) => ({
      ...degree,
      doctorProfileId: doctorProfileId,
    }));

    const requests: Observable<unknown>[] = [];

    normalizedUpdates.forEach((degree) => {
      if (degree.id) {
        requests.push(this.doctorDegreeService.update(degree));
      } else {
        const { id, ...payload } = degree;
        requests.push(this.doctorDegreeService.create(payload));
      }
    });

    const updatedIds = new Set(
      normalizedUpdates
        .filter((degree) => degree.id)
        .map((degree) => degree.id as number)
    );

    existingDegrees
      .filter((degree) => degree.id && !updatedIds.has(degree.id))
      .forEach((degree) => {
        requests.push(this.doctorDegreeService.delete(degree.id!));
      });

    return requests.length ? forkJoin(requests).pipe(map(() => void 0)) : of(void 0);
  }

  private syncSpecializations(
    doctorProfileId: number,
    nextSpecializations: DoctorSpecializationInputDto[] = [],
    existingSpecializations: DoctorSpecializationDto[] = []
  ): Observable<void> {
    const normalizedUpdates = (nextSpecializations ?? []).map(
      (specialization) => ({
        ...specialization,
        doctorProfileId: doctorProfileId,
      })
    );

    const requests: Observable<unknown>[] = [];

    normalizedUpdates.forEach((specialization) => {
      if (specialization.id) {
        requests.push(this.doctorSpecializationService.update(specialization));
      } else {
        const { id, ...payload } = specialization;
        requests.push(this.doctorSpecializationService.create(payload));
      }
    });

    const updatedIds = new Set(
      normalizedUpdates
        .filter((specialization) => specialization.id)
        .map((specialization) => specialization.id as number)
    );

    existingSpecializations
      .filter(
        (specialization) =>
          specialization.id && !updatedIds.has(specialization.id)
      )
      .forEach((specialization) => {
        requests.push(
          this.doctorSpecializationService.delete(specialization.id!)
        );
      });

    return requests.length ? forkJoin(requests).pipe(map(() => void 0)) : of(void 0);
  }

  private evaluateOnboardingState(profile: DoctorProfileDto): void {
    if (!profile?.id) {
      this.showProfileOnboarding = false;
      return;
    }
    this.showProfileOnboarding = this.shouldPromptForOnboarding(profile);
  }

  private shouldPromptForOnboarding(profile: DoctorProfileDto): boolean {
    console.log(profile);

    if (!profile) {
      return true;
    }

    const isProfileStepCompleted = profile.profileStep >= 5 ? true : false;

    return !isProfileStepCompleted;
  }
}
