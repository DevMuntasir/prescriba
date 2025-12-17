import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { DoctorChamberDto, DoctorScheduleDto } from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import type { DoctorChamberInputDto } from 'src/app/api/input-dto/models';
import {
  DistrictModel,
  DivisionModel,
  LocationService,
} from 'src/app/api/services/location.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorScheduleBuilderComponent } from './schedule-builder/doctor-schedule-builder.component';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DoctorScheduleBuilderComponent],
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
})
export class HospitalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(TosterService);
  private readonly locationService = inject(LocationService);

  readonly chamberForm = this.formBuilder.nonNullable.group({
    chamberName: ['', [Validators.required, Validators.maxLength(120)]],
    address: ['', [Validators.required, Validators.maxLength(250)]],
    divisionId: ['', [Validators.required]],
    districtId: ['', [Validators.required]],
    isVisibleOnPrescription: [true],
  });

  readonly maxVisibleOnPrescription = 3;
  visibilityToggleDisabled = false;
  visibilityLimitMessage: string | null = null;

  chambers: DoctorChamberDto[] = [];
  isLoadingList = false;
  isSaving = false;
  loadError?: string;

  doctorProfileId: number | null = null;
  isFormOpen = false;
  editingChamberId: number | null = null;

  isScheduleBuilderOpen = false;
  selectedScheduleChamberId: number | null = null;

  divisions: DivisionModel[] = [];
  districts: DistrictModel[] = [];
  isLoadingDivisions = false;
  isLoadingDistricts = false;
  divisionError?: string;
  districtError?: string;
  private pendingDistrictId: string | null = null;
  private suppressDivisionWatcher = false;

  constructor() {
    this.setupDivisionControlListener();
    this.loadDivisions();
    const authInfo = this.authService.authInfo();
    this.doctorProfileId = authInfo?.id ?? null;

    if (!this.doctorProfileId) {
      this.chamberForm.disable();
      this.loadError =
        'Doctor profile not found. Please log in again to manage your chambers.';
      return;
    }

    this.loadChambers();
  }

  get hasChambers(): boolean {
    return this.chambers.length > 0;
  }

  private get visibleOnPrescriptionCount(): number {
    return this.chambers.filter(c => c.isVisibleOnPrescription).length;
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

  openForm(chamber?: DoctorChamberDto): void {
    if (this.chamberForm.disabled) {
      return;
    }

    if (chamber) {
      // Edit mode - populate form with existing data
      this.editingChamberId = chamber.id ?? null;
      this.pendingDistrictId = chamber.districtId
        ? String(chamber.districtId)
        : null;
      this.suppressDivisionWatcher = true;
      this.chamberForm.patchValue({
        chamberName: chamber.chamberName ?? '',
        address: chamber.address ?? '',
        divisionId: chamber.divisionId ? String(chamber.divisionId) : '',
        districtId: '',
        isVisibleOnPrescription: chamber.isVisibleOnPrescription ?? true,
      });
      this.suppressDivisionWatcher = false;

      if (chamber.divisionId) {
        this.loadDistrictsForDivision(chamber.divisionId);
      } else {
        this.pendingDistrictId = null;
        this.districts = [];
      }
    } else {
      // Create mode - reset form
      this.editingChamberId = null;
      this.resetChamberForm();
    }

    this.isFormOpen = true;
    this.updateVisibilityToggleState(chamber ?? null);
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingChamberId = null;
    this.resetChamberForm();
    this.resetVisibilityToggleState();
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

    const rawValue = this.chamberForm.getRawValue();
    const divisionId = this.toNumber(rawValue.divisionId);
    const districtId = this.toNumber(rawValue.districtId);
    const selectedDivision = divisionId
      ? this.divisions.find(division => division.divisionID === divisionId)
      : undefined;
    const selectedDistrict = districtId
      ? this.districts.find(district => district.districtID === districtId)
      : undefined;

    const payload: DoctorChamberInputDto = {
      doctorProfileId: this.doctorProfileId,
      chamberName: rawValue.chamberName,
      address: rawValue.address,
      divisionId,
      divisionName: selectedDivision?.divisionName,
      districtId,
      districtName: selectedDistrict?.districtName,
      isVisibleOnPrescription: rawValue.isVisibleOnPrescription,
      id: this.editingChamberId as number,
    };

    if (
      payload.isVisibleOnPrescription &&
      !this.canEnableVisibility(this.editingChamberId)
    ) {
      this.toaster.customToast(
        'You can show up to ' +
          this.maxVisibleOnPrescription +
          ' hospitals on the prescription header. Please uncheck another hospital first.',
        'error'
      );
      return;
    }

    this.isSaving = true;

    // Check if we're editing or creating
    const operation = this.editingChamberId
      ? this.doctorChamberService.update(payload)
      : this.doctorChamberService.create(payload);

    operation.subscribe({
      next: (chamber) => {
        const isEditing = !!this.editingChamberId;

        this.toaster.customToast(
          isEditing
            ? 'Hospital/Chamber information updated successfully.'
            : 'Hospital/Chamber information saved successfully.',
          'success'
        );

        if (isEditing) {
          // Update the chamber in the list
          const index = this.chambers.findIndex(c => c.id === this.editingChamberId);
          if (index !== -1) {
            this.chambers[index] = chamber;
          }
        } else {
          // Add new chamber to the beginning of the list
          this.chambers = [chamber, ...this.chambers];
        }

        this.isSaving = false;
        this.closeForm();
      },
      error: () => {
        this.isSaving = false;
        this.toaster.customToast(
          this.editingChamberId
            ? 'Could not update the hospital information. Please try again.'
            : 'Could not save the hospital information. Please try again.',
          'error'
        );
      },
    });
  }

  refresh(): void {
    this.loadChambers();
  }

  openScheduleBuilder(chamberId: number | null): void {
    if (!this.doctorProfileId || !chamberId) {
      return;
    }

    this.selectedScheduleChamberId = chamberId;
    this.isScheduleBuilderOpen = true;
  }

  closeScheduleBuilder(): void {
    this.isScheduleBuilderOpen = false;
  }

  handleScheduleCreated(_: DoctorScheduleDto): void {
    this.isScheduleBuilderOpen = false;
  }

  trackByChamber(index: number, chamber: DoctorChamberDto): number {
    return chamber.id ?? index;
  }

  private setupDivisionControlListener(): void {
    this.chamberForm
      .get('divisionId')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (this.suppressDivisionWatcher) {
          return;
        }
        this.onDivisionChanged((value as string) ?? '');
      });
  }

  private onDivisionChanged(value: string): void {
    this.pendingDistrictId = null;
    this.districtError = undefined;
    const districtControl = this.chamberForm.get('districtId');
    districtControl?.setValue('', { emitEvent: false });

    const divisionId = this.toNumber(value);
    if (!divisionId) {
      this.districts = [];
      this.isLoadingDistricts = false;
      return;
    }

    this.loadDistrictsForDivision(divisionId);
  }

  private loadDivisions(): void {
    this.isLoadingDivisions = true;
    this.divisionError = undefined;
    this.locationService.getDivisions().subscribe({
      next: (response) => {
        this.divisions = response.results ?? [];
        this.isLoadingDivisions = false;
      },
      error: () => {
        this.isLoadingDivisions = false;
        this.divisionError =
          'Failed to load division list. Please refresh the page.';
      },
    });
  }

  private loadDistrictsForDivision(divisionId: number): void {
    if (!divisionId) {
      this.districts = [];
      return;
    }

    this.isLoadingDistricts = true;
    this.districtError = undefined;

    this.locationService.getDistricts(divisionId).subscribe({
      next: (response) => {
        this.districts = response.results ?? [];
        this.isLoadingDistricts = false;

        if (this.pendingDistrictId) {
          const hasMatch = this.districts.some(
            district => String(district.districtID) === this.pendingDistrictId
          );

          if (hasMatch) {
            this.chamberForm.patchValue(
              { districtId: this.pendingDistrictId },
              { emitEvent: false }
            );
          }

          this.pendingDistrictId = null;
        }
      },
      error: () => {
        this.districts = [];
        this.isLoadingDistricts = false;
        this.districtError =
          'Failed to load districts. Please change the division or try again.';
      },
    });
  }

  private resetChamberForm(): void {
    this.pendingDistrictId = null;
    this.districts = [];
    this.districtError = undefined;
    this.isLoadingDistricts = false;
    this.suppressDivisionWatcher = true;
    this.chamberForm.reset({
      chamberName: '',
      address: '',
      divisionId: '',
      districtId: '',
      isVisibleOnPrescription: true,
    });
    this.suppressDivisionWatcher = false;
  }

  private toNumber(value: string | null | undefined): number | undefined {
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
  }

  private resetVisibilityToggleState(): void {
    const control = this.chamberForm.get('isVisibleOnPrescription');
    this.visibilityToggleDisabled = false;
    this.visibilityLimitMessage = null;
    control?.enable({ emitEvent: false });
  }

  private canEnableVisibility(chamberId: number | null): boolean {
    if (this.visibleOnPrescriptionCount < this.maxVisibleOnPrescription) {
      return true;
    }

    if (!chamberId) {
      return false;
    }

    const chamber = this.chambers.find(c => c.id === chamberId);
    return !!chamber?.isVisibleOnPrescription;
  }

  private updateVisibilityToggleState(chamber: DoctorChamberDto | null): void {
    const control = this.chamberForm.get('isVisibleOnPrescription');
    if (!control) {
      return;
    }

    if (!this.isFormOpen) {
      this.resetVisibilityToggleState();
      return;
    }

    if (this.canEnableVisibility(chamber?.id ?? null)) {
      if (control.disabled) {
        control.enable({ emitEvent: false });
      }
      this.visibilityToggleDisabled = false;
      this.visibilityLimitMessage = null;
      return;
    }

    this.visibilityToggleDisabled = true;
    control.disable({ emitEvent: false });
    control.setValue(false, { emitEvent: false });
    this.visibilityLimitMessage =
      'Only ' +
      this.maxVisibleOnPrescription +
      ' hospitals can be shown on the prescription header at a time.';
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
          const editingChamber = this.editingChamberId
            ? this.chambers.find(c => c.id === this.editingChamberId) ?? null
            : null;
          this.updateVisibilityToggleState(editingChamber);
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
