import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { DoctorChamberDto } from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import type { DoctorChamberInputDto } from 'src/app/api/input-dto/models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
})
export class HospitalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(TosterService);
  private doctorProfileId: number | null = null;

  readonly chamberForm = this.formBuilder.nonNullable.group({
    chamberName: ['', [Validators.required, Validators.maxLength(120)]],
    address: ['', [Validators.required, Validators.maxLength(250)]],
    city: ['', [Validators.required, Validators.maxLength(80)]],
    zipCode: ['', [Validators.required, Validators.maxLength(10)]],
    country: ['', [Validators.required, Validators.maxLength(80)]],
    isVisibleOnPrescription: [true],
  });

  chambers: DoctorChamberDto[] = [];
  isLoadingList = false;
  isSaving = false;
  loadError?: string;

  constructor() {
    const authInfo = this.authService.authInfo();
    this.doctorProfileId = authInfo?.id ?? null;

    if (!this.doctorProfileId) {
      this.chamberForm.disable();
      this.loadError =
        'Doctor profile not found. Please log in again to manage your chambers.';
    } else {
      this.loadChambers();
    }
  }

  get hasChambers(): boolean {
    return this.chambers.length > 0;
  }

  hasError(controlName: keyof typeof this.chamberForm.controls): boolean {
    const control = this.chamberForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(
    controlName: keyof typeof this.chamberForm.controls
  ): string | null {
    const control = this.chamberForm.get(controlName);
    if (!control || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'This field is required';
    }

    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    }

    return null;
  }

  onSubmit(): void {
    if (!this.doctorProfileId) {
      this.toaster.customToast(
        'Cannot detect doctor profile. Please refresh and try again.',
        'error'
      );
      return;
    }

    if (this.chamberForm.invalid) {
      this.chamberForm.markAllAsTouched();
      return;
    }

    const payload: DoctorChamberInputDto = {
      doctorProfileId: this.doctorProfileId,
      ...this.chamberForm.getRawValue(),
    };

    this.isSaving = true;
    this.doctorChamberService.create(payload).subscribe({
      next: (chamber) => {
        this.toaster.customToast(
          'Hospital/Chamber information saved successfully.',
          'success'
        );
        this.chamberForm.reset({
          chamberName: '',
          address: '',
          city: '',
          zipCode: '',
          country: payload.country,
          isVisibleOnPrescription: true,
        });
        this.chambers = [chamber, ...this.chambers];
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
        this.toaster.customToast(
          'Could not save the hospital information. Please try again.',
          'error'
        );
      },
    });
  }

  refresh(): void {
    this.loadChambers();
  }

  trackByChamber(index: number, chamber: DoctorChamberDto): number {
    return chamber.id ?? index;
  }

  private loadChambers(): void {
    if (!this.doctorProfileId) {
      return;
    }

    this.isLoadingList = true;
    this.loadError = undefined;

    this.doctorChamberService
      .getListByDoctorId(this.doctorProfileId)
      .subscribe({
        next: (response) => {
          this.chambers = response ?? [];
          this.isLoadingList = false;
        },
        error: () => {
          this.isLoadingList = false;
          this.loadError =
            'Failed to load your saved hospitals. Please try again.';
        },
      });
  }
}
