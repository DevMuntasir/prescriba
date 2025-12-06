import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DegreeDto,
  DoctorDegreeDto,
  DoctorProfileDto,
  DoctorSpecializationDto,
  SpecialityDto,
} from 'src/app/api/dto-models';
import { DoctorProfileInputDto } from 'src/app/api/input-dto';
import { DegreeService, SpecialityService } from 'src/app/api/services';

@Component({
  selector: 'app-profile-onboarding-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-onboarding-modal.component.html',
  styleUrls: ['./profile-onboarding-modal.component.scss'],
})
export class ProfileOnboardingModalComponent implements OnChanges, OnInit {
  @Input() open = false;
  @Input() profile: DoctorProfileDto | null = null;
  @Input() saving = false;
  @Output() completed = new EventEmitter<DoctorProfileInputDto>();
  @Output() chambersCreated = new EventEmitter<any[]>();
  @Output() schedulesCreated = new EventEmitter<any[]>();

  form: FormGroup;
  currentStep = 0;
  readonly steps = ['Professional details', 'Education & specialization', 'Hospital/Chamber', 'Schedule'];
  readonly countries = ['Bangladesh', 'India', 'Pakistan', 'Sri Lanka'];
  specialityOptions: SpecialityDto[] = [];
  degreeOptions: DegreeDto[] = [];
  readonly basicInfoLabels: Record<string, string> = {
    bmdcRegNo: 'BMDC Reg Number',
    bmdcRegExpiryDate: 'BMDC Exp. Date',
    address: 'Address',
    city: 'City',
    zipCode: 'Zip Code',
    country: 'Country',
    identityNumber: 'Identity Number',
    specialityName: 'Specialties *',
  };

  constructor(
    private fb: FormBuilder,
    private degreeService: DegreeService,
    private specialityService: SpecialityService
  ) {
    this.form = this.fb.group({
      basicInfo: this.fb.group({
        bmdcRegNo: ['', Validators.required],
        bmdcRegExpiryDate: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['Bangladesh', Validators.required],
        identityNumber: ['', Validators.required],
        specialityName: ['', Validators.required],
      }),
      degrees: this.fb.array([this.createDegreeGroup()]),
      specializations: this.fb.array([this.createSpecializationGroup()]),
      chambers: this.fb.array([this.createChamberGroup()]),
      schedules: this.fb.array([this.createScheduleGroup()]),
    });
  }

  ngOnInit(): void {
    this.loadDegreeOptions();
    this.loadSpecialityOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && this.profile) {
      this.patchForm(this.profile);
    }

    if (changes['open'] && this.open) {
      this.resetStepperState();
    }
  }

  get basicInfoGroup(): FormGroup {
    return this.form.get('basicInfo') as FormGroup;
  }

  get degreesArray(): FormArray {
    return this.form.get('degrees') as FormArray;
  }

  get specializationsArray(): FormArray {
    return this.form.get('specializations') as FormArray;
  }

  get chambersArray(): FormArray {
    return this.form.get('chambers') as FormArray;
  }

  get schedulesArray(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  addDegree(): void {
    this.degreesArray.push(this.createDegreeGroup());
  }

  removeDegree(index: number): void {
    this.removeOrReset(this.degreesArray, index, () => this.createDegreeGroup());
  }

  addSpecialization(): void {
    this.specializationsArray.push(this.createSpecializationGroup());
  }

  removeSpecialization(index: number): void {
    this.removeOrReset(this.specializationsArray, index, () => this.createSpecializationGroup());
  }

  addChamber(): void {
    this.chambersArray.push(this.createChamberGroup());
  }

  removeChamber(index: number): void {
    this.removeOrReset(this.chambersArray, index, () => this.createChamberGroup());
  }

  addSchedule(): void {
    this.schedulesArray.push(this.createScheduleGroup());
  }

  removeSchedule(index: number): void {
    this.removeOrReset(this.schedulesArray, index, () => this.createScheduleGroup());
  }

  onDegreeSelected(index: number): void {
    const degreeGroup = this.degreesArray.at(index) as FormGroup;
    this.applyDegreeMetadata(degreeGroup);
  }

  onSpecialitySelected(index: number): void {
    const specialityGroup = this.specializationsArray.at(index) as FormGroup;
    this.applySpecialityMetadata(specialityGroup);
  }

  goToPreviousStep(): void {
    if (this.currentStep === 0) {
      return;
    }
    this.currentStep -= 1;
  }

  goToNextStep(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
    }
  }

  submit(): void {
    debugger
    this.form.markAllAsTouched();

    if (!this.validateCurrentStep(true)) {
      return;
    }

    const baseProfile = ({
      ...(this.profile ?? {}),
      degrees: this.profile?.degrees ?? [],
      doctorSpecialization: this.profile?.doctorSpecialization ?? [],
    }) as DoctorProfileInputDto;

    const basicInfo = this.basicInfoGroup.getRawValue();
    const formattedDegrees = this.degreesArray.getRawValue().map((degree: any) => {
      const degreeId = this.sanitizeNumber(degree.degreeId);

      return {
        ...degree,
        degreeId,
        degreeName: this.resolveDegreeName(degreeId, degree.degreeName),
        passingYear: degree.passingYear ? Number(degree.passingYear) : undefined,
      };
    });
    const formattedSpecializations = this.specializationsArray
      .getRawValue()
      .map((spec: any) => {
        const specialityId = this.sanitizeNumber(spec.specialityId);

        return {
          ...spec,
          specialityId,
          specialityName: this.resolveSpecialityName(
            specialityId,
            spec.specialityName
          ),
        };
      });

    const formattedChambers = this.chambersArray.getRawValue();
    const formattedSchedules = this.schedulesArray.getRawValue().map((schedule: any) => {
      // Get the actual chamber data from the selected index
      const chamberIndex = schedule.chamberIndex ?? 0;
      const selectedChamber = formattedChambers[chamberIndex];

      return {
        ...schedule,
        chamberName: selectedChamber?.chamberName,
      };
    });

    const updatedProfile: DoctorProfileInputDto = {
      ...baseProfile,
      ...basicInfo,
      degrees: formattedDegrees,
      doctorSpecialization: formattedSpecializations,
      profileStep: 5, // Updated to 5 since we now have 4 steps (0-3)
    };

    // Emit all the data
    this.completed.emit(updatedProfile);
    this.chambersCreated.emit(formattedChambers);
    this.schedulesCreated.emit(formattedSchedules);
  }

  patchForm(profile: DoctorProfileDto): void {
    this.basicInfoGroup.patchValue({
      bmdcRegNo: profile.bmdcRegNo ?? '',
      bmdcRegExpiryDate: profile.bmdcRegExpiryDate ?? '',
      address: profile.address ?? '',
      city: profile.city ?? '',
      zipCode: profile.zipCode ?? '',
      country: profile.country ?? 'Bangladesh',
      identityNumber: profile.identityNumber ?? '',
      specialityName: profile.specialityName ?? '',
    });

    this.setFormArray<DoctorDegreeDto>(
      this.degreesArray,
      profile.degrees ?? [],
      (degree) => this.createDegreeGroup(degree)
    );
    this.setFormArray<DoctorSpecializationDto>(
      this.specializationsArray,
      profile.doctorSpecialization ?? [],
      (specialization) => this.createSpecializationGroup(specialization)
    );

    this.syncDegreesWithOptions();
    this.syncSpecializationsWithOptions();
  }

  resetStepperState(): void {
    this.currentStep = 0;
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private createDegreeGroup(data?: DoctorDegreeDto): FormGroup {
    const group = this.fb.group({
      id: [data?.id ?? null],
      doctorProfileId: [data?.doctorProfileId ?? null],
      degreeId: [data?.degreeId ?? null, Validators.required],
      degreeName: [data?.degreeName ?? ''],
      passingYear: [
        data?.passingYear ?? '',
        [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)],
      ],
      instituteName: [data?.instituteName ?? '', Validators.required],
      instituteCity: [data?.instituteCity ?? '', Validators.required],
      instituteCountry: [
        data?.instituteCountry ?? 'Bangladesh',
        Validators.required,
      ],
    });

    this.applyDegreeMetadata(group);

    return group;
  }

  private createChamberGroup(): FormGroup {
    return this.fb.group({
      chamberName: ['', [Validators.required, Validators.maxLength(120)]],
      address: ['', [Validators.required, Validators.maxLength(250)]],
      city: ['', [Validators.required, Validators.maxLength(80)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10)]],
      country: ['Bangladesh', [Validators.required, Validators.maxLength(80)]],
      isVisibleOnPrescription: [true],
    });
  }

  private createScheduleGroup(): FormGroup {
    return this.fb.group({
      chamberIndex: [0, Validators.required],
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      slotDuration: [30, [Validators.required, Validators.min(5)]],
      maxPatients: [1, [Validators.required, Validators.min(1)]],
    });
  }
  private createSpecializationGroup(
    data?: DoctorSpecializationDto
  ): FormGroup {
    const group = this.fb.group({
      id: [data?.id ?? null],
      doctorProfileId: [data?.doctorProfileId ?? null],
      specialityId: [data?.specialityId ?? null, Validators.required],
      specialityName: [data?.specialityName ?? ''],
      specializationId: [data?.specializationId ?? null],
      specializationName: [
        data?.specializationName ?? '',
        Validators.required,
      ],
      serviceDetails: [data?.serviceDetails ?? ''],
      documentName: [data?.documentName ?? ''],
    });

    this.applySpecialityMetadata(group);

    return group;
  }

  private loadDegreeOptions(): void {
    this.degreeService.getList().subscribe({
      next: (degrees) => {
        this.degreeOptions = degrees ?? [];
        this.syncDegreesWithOptions();
      },
      error: (error) => {
        console.error('Failed to load degree options', error);
      },
    });
  }

  private loadSpecialityOptions(): void {
    this.specialityService.getList().subscribe({
      next: (specialities) => {
        this.specialityOptions = specialities ?? [];
        this.syncSpecializationsWithOptions();
      },
      error: (error) => {
        console.error('Failed to load speciality options', error);
      },
    });
  }

  private syncDegreesWithOptions(): void {
    this.degreesArray.controls.forEach((control) =>
      this.applyDegreeMetadata(control as FormGroup)
    );
  }

  private syncSpecializationsWithOptions(): void {
    this.specializationsArray.controls.forEach((control) =>
      this.applySpecialityMetadata(control as FormGroup)
    );
  }

  private applyDegreeMetadata(group: FormGroup): void {
    const degreeId = this.sanitizeNumber(group.get('degreeId')?.value);

    if (degreeId !== undefined) {
      const match = this.degreeOptions.find((degree) => degree.id === degreeId);

      if (match?.degreeName) {
        group.patchValue(
          {
            degreeId: match.id ?? degreeId ?? null,
            degreeName: match.degreeName,
          },
          { emitEvent: false }
        );
      }

      return;
    }

    const degreeName = group.get('degreeName')?.value as string | undefined;

    if (!degreeName) {
      return;
    }

    const matchByName = this.degreeOptions.find(
      (degree) =>
        degree.degreeName?.toLowerCase() === degreeName.toLowerCase()
    );

    if (matchByName) {
      group.patchValue(
        {
          degreeId: matchByName.id ?? null,
          degreeName: matchByName.degreeName ?? degreeName,
        },
        { emitEvent: false }
      );
    }
  }

  private applySpecialityMetadata(group: FormGroup): void {
    const specialityId = this.sanitizeNumber(group.get('specialityId')?.value);

    if (specialityId !== undefined) {
      const match = this.specialityOptions.find(
        (speciality) => speciality.id === specialityId
      );

      if (match?.specialityName) {
        group.patchValue(
          {
            specialityId: match.id ?? specialityId ?? null,
            specialityName: match.specialityName,
          },
          { emitEvent: false }
        );
      }

      return;
    }

    const specialityName = group.get('specialityName')?.value as string | undefined;

    if (!specialityName) {
      return;
    }

    const matchByName = this.specialityOptions.find(
      (speciality) =>
        speciality.specialityName?.toLowerCase() === specialityName.toLowerCase()
    );

    if (matchByName) {
      group.patchValue(
        {
          specialityId: matchByName.id ?? null,
          specialityName: matchByName.specialityName ?? specialityName,
        },
        { emitEvent: false }
      );
    }
  }

  private resolveDegreeName(id?: number, fallback?: string): string {
    if (id === undefined) {
      return fallback ?? '';
    }

    return (
      this.degreeOptions.find((degree) => degree.id === id)?.degreeName ??
      fallback ??
      ''
    );
  }

  private resolveSpecialityName(id?: number, fallback?: string): string {
    if (id === undefined) {
      return fallback ?? '';
    }

    return (
      this.specialityOptions.find((speciality) => speciality.id === id)?.specialityName ??
      fallback ??
      ''
    );
  }

  private setFormArray<T>(
    array: FormArray,
    items: T[] | undefined,
    factory: (value?: T) => FormGroup
  ): void {
    while (array.length) {
      array.removeAt(0);
    }

    if (!items || items.length === 0) {
      array.push(factory());
      return;
    }

    items.forEach((item) => array.push(factory(item)));
  }

  private validateCurrentStep(includeFutureSteps = false): boolean {
    const stepsToValidate = includeFutureSteps ? [0, 1, 2, 3] : [this.currentStep];
    let valid = true;

    if (stepsToValidate.includes(0)) {
      this.basicInfoGroup.markAllAsTouched();
      valid = valid && this.basicInfoGroup.valid;
    }

    if (stepsToValidate.includes(1)) {
      this.degreesArray.controls.forEach((group) => {
        (group as FormGroup).markAllAsTouched();
        if ((group as FormGroup).invalid) {
          valid = false;
        }
      });
      this.specializationsArray.controls.forEach((group) => {
        (group as FormGroup).markAllAsTouched();
        if ((group as FormGroup).invalid) {
          valid = false;
        }
      });
    }

    if (stepsToValidate.includes(2)) {
      this.chambersArray.controls.forEach((group) => {
        (group as FormGroup).markAllAsTouched();
        if ((group as FormGroup).invalid) {
          valid = false;
        }
      });
    }

    if (stepsToValidate.includes(3)) {
      this.schedulesArray.controls.forEach((group) => {
        (group as FormGroup).markAllAsTouched();
        if ((group as FormGroup).invalid) {
          valid = false;
        }
      });
    }

    return valid;
  }

  private removeOrReset(
    array: FormArray,
    index: number,
    factory: () => FormGroup
  ): void {
    if (array.length <= 1) {
      const defaults = factory();
      (array.at(0) as FormGroup).reset(defaults.value);
      return;
    }

    array.removeAt(index);
  }

  private sanitizeNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}

