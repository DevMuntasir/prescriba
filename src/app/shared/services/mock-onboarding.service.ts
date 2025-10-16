import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DoctorProfileDto } from 'src/app/proxy/dto-models';

export interface SignupPayload {
  mobileNo: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockOnboardingService {
  private readonly credentialKeyPrefix = 'mockCredentials';
  private readonly profileKeyPrefix = 'mockDoctorProfile';
  private readonly completionKeyPrefix = 'mockDoctorProfileCompleted';

  signup(payload: SignupPayload): Observable<DoctorProfileDto> {
    const profileId = Date.now();
    const mockProfile: DoctorProfileDto = {
      id: profileId,
      userId: `doctor-${profileId}`,
      fullName: `Doctor ${payload.mobileNo.slice(-4)}`,
      doctorTitleName: 'Dr.',
      mobileNo: payload.mobileNo,
      profileStep: 0,
      degrees: [],
      doctorSpecialization: [],
    };

    const credentialPayload = {
      mobileNo: payload.mobileNo,
      password: payload.password,
      profileId: mockProfile.id,
      userId: mockProfile.userId,
    };

    localStorage.setItem(this.profileStorageKey(profileId), JSON.stringify(mockProfile));
    localStorage.setItem(this.completionStorageKey(profileId), JSON.stringify(false));
    localStorage.setItem(this.credentialKeyPrefix, JSON.stringify(credentialPayload));

    return of(mockProfile).pipe(delay(400));
  }

  getStoredProfile(profileId: number | null | undefined): DoctorProfileDto | null {
    if (profileId == null) {
      return null;
    }
    const stored = localStorage.getItem(this.profileStorageKey(profileId));
    return stored ? (JSON.parse(stored) as DoctorProfileDto) : null;
  }

  saveProfile(profile: DoctorProfileDto): DoctorProfileDto {
    if (!profile?.id) {
      throw new Error('Profile must include an id before saving.');
    }
    const profileId = profile.id as number;
    const current: DoctorProfileDto = {
      ...profile,
      degrees: profile.degrees ?? [],
      doctorSpecialization: profile.doctorSpecialization ?? [],
    };
    localStorage.setItem(this.profileStorageKey(profileId), JSON.stringify(current));
    return current;
  }

  completeProfile(profile: DoctorProfileDto): Observable<DoctorProfileDto> {
    const saved = this.saveProfile({
      ...profile,
      profileStep: profile.profileStep ?? 3,
    });
    if (saved.id != null) {
      this.markProfileComplete(saved.id);
    }
    return of(saved).pipe(delay(300));
  }

  markProfileComplete(profileId: number): void {
    localStorage.setItem(this.completionStorageKey(profileId), JSON.stringify(true));
  }

  isProfileComplete(profileId: number | null | undefined): boolean {
    if (!profileId) {
      return false;
    }
    const stored = localStorage.getItem(this.completionStorageKey(profileId));
    return stored ? stored === 'true' : false;
  }

  shouldShowOnboarding(profileId: number | null | undefined): boolean {
    return !this.isProfileComplete(profileId);
  }

  private profileStorageKey(profileId: number): string {
    return `${this.profileKeyPrefix}:${profileId}`;
  }

  private completionStorageKey(profileId: number): string {
    return `${this.completionKeyPrefix}:${profileId}`;
  }
}
