import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DoctorProfileDto } from 'src/app/api/dto-models';
import {
  DoctorDegreeInputDto,
  DoctorProfileInputDto,
  DoctorSpecializationInputDto,
} from 'src/app/api/input-dto';
import { DoctorTitle, doctorTitleOptions } from 'src/app/api/enums/doctor-title.enum';
import { DoctorProfileService } from 'src/app/api/services';
import { TosterService } from 'src/app/shared/services/toster.service';

@Component({
  selector: 'app-doctor-basic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorBasicInfoComponent implements OnChanges {
  @Input() profile: DoctorProfileDto | null = null;
  @Output() updated = new EventEmitter<void>();

  readonly titleOptions = doctorTitleOptions;
  readonly specialityOptions = [];

  saving = false;
  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorProfileService: DoctorProfileService,
    private toaster: TosterService
  ) {
    this.form = this.fb.group({
      doctorTitle: [null, Validators.required],
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.minLength(6)]],
      bmdcRegNo: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      bmdcRegExpiryDate: [null, Validators.required],
      identityNumber: ['', Validators.required],
      specialityId: [null],

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']) {
      this.patchForm(changes['profile'].currentValue as DoctorProfileDto | null);
    }
  }

  submit(): void {
    if (!this.profile?.id) {
      this.toaster.customToast('Doctor id missing, reload and try again.', 'error');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const payload: DoctorProfileInputDto = {
      id: this.profile.id,
      doctorTitle: this.toNumber(formValue.doctorTitle) as DoctorTitle | undefined,
      fullName: formValue.fullName?.trim(),
      email: formValue.email?.trim(),
      mobileNo: formValue.mobileNo?.trim(),
      bmdcRegNo: formValue.bmdcRegNo?.trim(),
      city: formValue.city?.trim(),
      country: formValue.country?.trim(),
      address: formValue.address?.trim(),
      bmdcRegExpiryDate: formValue.bmdcRegExpiryDate,
      profileStep: this.profile.profileStep,
      identityNumber: formValue.identityNumber?.trim(),
      specialityId: this.toNumber(formValue.specialityId),
      degrees: (this.profile.degrees ?? []) as DoctorDegreeInputDto[],
      doctorSpecialization: (this.profile.doctorSpecialization ?? []) as DoctorSpecializationInputDto[],
      isActive: true,

    };

    this.saving = true;
    this.doctorProfileService.update(payload).subscribe({
      next: () => {
        this.saving = false;
        this.toaster.customToast('Basic information updated successfully.', 'success');
        this.updated.emit();
      },
      error: (error) => {
        this.saving = false;
        this.toaster.customToast(
          error?.message ?? 'Unable to update information, please try again.',
          'error'
        );
      },
    });
  }

  private patchForm(profile: DoctorProfileDto | null): void {
    if (!profile) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      doctorTitle: profile.doctorTitle ?? null,
      fullName: profile.fullName ?? '',
      email: profile.email ?? '',
      mobileNo: profile.mobileNo ?? '',
      bmdcRegNo: profile.bmdcRegNo ?? '',
      city: profile.city ?? '',
      country: profile.country ?? '',
      address: profile.address ?? '',
      bmdcRegExpiryDate: this.formatDateForInput(profile.bmdcRegExpiryDate),
      identityNumber: profile.identityNumber ?? '',
      specialityId: profile.specialityId ?? null,
    });
  }

  private formatDateForInput(dateString: string | undefined | null): string | null {
    if (!dateString) return null;
    // Extract YYYY-MM-DD from ISO string or return as is if already in that format
    return dateString.split('T')[0];
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
