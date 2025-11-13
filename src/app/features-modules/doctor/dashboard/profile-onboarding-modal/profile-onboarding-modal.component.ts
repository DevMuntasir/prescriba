import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
  DoctorDegreeDto,
  DoctorProfileDto,
  DoctorSpecializationDto,
} from 'src/app/api/dto-models';
import { DoctorProfileInputDto } from 'src/app/api/input-dto';

@Component({
  selector: 'app-profile-onboarding-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-onboarding-modal.component.html',
  styleUrls: ['./profile-onboarding-modal.component.scss'],
})
export class ProfileOnboardingModalComponent implements OnChanges {
  @Input() open = false;
  @Input() profile: DoctorProfileDto | null = null;
  @Input() saving = false;
  @Output() completed = new EventEmitter<DoctorProfileInputDto>();

  form: FormGroup;
  currentStep = 0;
  readonly steps = ['Professional details', 'Education & specialization'];
  readonly countries = ['Bangladesh', 'India', 'Pakistan', 'Sri Lanka'];
  readonly specialityOptions = [
    'Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
  ];
  readonly degreeOptions = ['MBBS', 'FCPS', 'MD', 'MS', 'MRCP'];
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

  constructor(private fb: FormBuilder) {
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
    });
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
    const formattedDegrees = this.degreesArray.getRawValue().map((degree: any) => ({
      ...degree,
      passingYear: degree.passingYear ? Number(degree.passingYear) : undefined,
    }));
    const formattedSpecializations = this.specializationsArray
      .getRawValue()
      .map((spec: any) => ({
        ...spec,
      }));

    const updatedProfile: DoctorProfileInputDto = {
      ...baseProfile,
      ...basicInfo,
      degrees: formattedDegrees,
      doctorSpecialization: formattedSpecializations,
      profileStep: 3,
    };

    this.completed.emit(updatedProfile);
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
  }

  resetStepperState(): void {
    this.currentStep = 0;
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private createDegreeGroup(data?: DoctorDegreeDto): FormGroup {
    return this.fb.group({
      id: [data?.id ?? null],
      doctorProfileId: [data?.doctorProfileId ?? null],
      degreeId: [data?.degreeId ?? null],
      degreeName: [data?.degreeName ?? '', Validators.required],
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
  }

  private createSpecializationGroup(
    data?: DoctorSpecializationDto
  ): FormGroup {
    return this.fb.group({
      id: [data?.id ?? null],
      doctorProfileId: [data?.doctorProfileId ?? null],
      specialityId: [data?.specialityId ?? null],
      specialityName: [data?.specialityName ?? '', Validators.required],
      specializationId: [data?.specializationId ?? null],
      specializationName: [
        data?.specializationName ?? '',
        Validators.required,
      ],
      serviceDetails: [data?.serviceDetails ?? ''],
      documentName: [data?.documentName ?? ''],
    });
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
    const stepsToValidate = includeFutureSteps ? [0, 1] : [this.currentStep];
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







