import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DoctorProfileDto } from 'src/app/api/dto-models';
import { DoctorProfileService } from 'src/app/api/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorBasicInfoComponent } from './components/basic-info/basic-info.component';
import { DoctorDegreeDetailsComponent } from './components/degrees/degree-details.component';
import { DoctorSpecializationDetailsComponent } from './components/specializations/specialization-details.component';
import { DoctorDocumentsComponent } from './components/documents/documents.component';
import { ExperienceComponent } from './components/experience/experience.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  standalone: true,
  styleUrls: ['./profile-settings.component.scss'],
  imports: [
    CommonModule,
    DoctorBasicInfoComponent,
    DoctorDegreeDetailsComponent,
    DoctorSpecializationDetailsComponent,
    DoctorDocumentsComponent,
    ExperienceComponent
  ],
})
export class ProfileSettingsComponent implements OnInit {
  private readonly doctorProfileService = inject(DoctorProfileService);
  private readonly authService = inject(AuthService);
  private readonly userStateService = inject(UserinfoStateService);
  private readonly toaster = inject(TosterService);

  doctorProfile: DoctorProfileDto | null = null;
  loading = true;
  error?: string;
  experience!: string;

  ngOnInit(): void {
    const authInfo = this.authService.authInfo();
    const doctorId = authInfo?.id;

    if (!doctorId) {
      this.loading = false;
      this.error = 'Unable to find your doctor profile id.';
      return;
    }

    this.loadProfile(doctorId);
    this.getDoctorExpertise(doctorId);
  }

  handleProfileUpdated(): void {
    if (!this.doctorProfile?.id) {
      return;
    }

    this.loadProfile(this.doctorProfile.id);
  }

  private loadProfile(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.doctorProfileService.get(id).subscribe({
      next: (profile) => {
        this.doctorProfile = profile;
        this.loading = false;
        this.userStateService.sendData(profile);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Unable to load profile right now.';
        this.toaster.customToast(
          error?.message ?? 'Unable to load profile right now.',
          'error'
        );
      },
    });
  }


  saveExperience(docString:string) {
    if (!this.doctorProfile?.id) {
      return;
    }
      this.doctorProfileService
        .updateExpertiseByIdAndExpertise(this.doctorProfile?.id, docString)
        .subscribe({
          next: (res) => {
            this.toaster.customToast(
              'Successfully update your expertise!',
              'success'
            );
          },
          error: () => {
            this.toaster.customToast('Something went wrong!', 'error');
          },
        });
    } 
  
  getDoctorExpertise(doctorId: number) {
    if (!doctorId) {
      return;
    }
    this.doctorProfileService
      .getDoctorByProfileId(doctorId)
      .subscribe((res) => {
        this.experience = res.expertise ? res.expertise : '';
      });
  }





}
