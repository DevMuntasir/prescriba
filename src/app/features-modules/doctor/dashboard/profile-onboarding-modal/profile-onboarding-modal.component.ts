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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DoctorProfileDto } from 'src/app/proxy/dto-models';

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
  @Output() completed = new EventEmitter<DoctorProfileDto>();

  form: FormGroup;
  currentStep = 0;
  readonly steps = ['Basic information', 'Professional details'];

  private readonly stepControlMap: string[][] = [
    ['doctorTitleName', 'fullName', 'email'],
    ['specialityName', 'areaOfExperties'],
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      doctorTitleName: ['Dr.', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      specialityName: ['', [Validators.required]],
      areaOfExperties: ['', [Validators.required, Validators.minLength(10)]],
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

  patchForm(profile: DoctorProfileDto): void {
    this.form.patchValue({
      doctorTitleName: profile.doctorTitleName ?? 'Dr.',
      fullName: profile.fullName ?? '',
      email: profile.email ?? '',
      specialityName: profile.specialityName ?? '',
      areaOfExperties: profile.areaOfExperties ?? '',
    });
  }

  resetStepperState(): void {
    this.currentStep = 0;
    this.form.markAsUntouched();
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

    const baseProfile =
      this.profile ?? ({ id: Date.now(), degrees: [], doctorSpecialization: [] } as DoctorProfileDto);

    const updatedProfile: DoctorProfileDto = {
      ...baseProfile,
      ...this.form.value,
      profileStep: 3,
    };

    this.completed.emit(updatedProfile);
  }

  private validateCurrentStep(includeFutureSteps = false): boolean {
    const controlsToValidate = includeFutureSteps
      ? this.stepControlMap.flat()
      : this.stepControlMap[this.currentStep];

    let valid = true;
    controlsToValidate.forEach((controlName) => {
      const control = this.form.get(controlName);
      control?.markAsTouched();
      if (control?.invalid) {
        valid = false;
      }
    });
    return valid;
  }
}
