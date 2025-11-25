import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DoctorSpecializationDto,
  SpecialityDto,
  SpecializationDto,
} from 'src/app/api/dto-models';
import { DoctorSpecializationInputDto } from 'src/app/api/input-dto';
import {
  DoctorSpecializationService,
  SpecialityService,
  SpecializationService,
} from 'src/app/api/services';
import { TosterService } from 'src/app/shared/services/toster.service';

@Component({
  selector: 'app-doctor-specializations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './specialization-details.component.html',
  styleUrls: ['./specialization-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSpecializationDetailsComponent implements OnInit {
  @Input() doctorId: number | null = null;
  @Input() specializations: DoctorSpecializationDto[] | null = [];
  @Output() updated = new EventEmitter<void>();

  specialityOptions: SpecialityDto[] = [];
  specializationOptions: SpecializationDto[] = [];
  allSpecializations: SpecializationDto[] = [];
  saving = false;
  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specialityService: SpecialityService,
    private specializationService: SpecializationService,
    private doctorSpecializationService: DoctorSpecializationService,
    private toaster: TosterService
  ) {
    this.form = this.fb.group({
      id: [null],
      specialityId: [null, Validators.required],
      specializationId: [null, Validators.required],
      serviceDetails: ['', Validators.maxLength(500)],
      documentName: [''],
    });
  }

  ngOnInit(): void {
    this.loadSpecialities();
    this.loadAllSpecializations();
    this.form
      .get('specialityId')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((specialityId) => {
        this.setSpecializationOptions(Number(specialityId));
        this.form.get('specializationId')?.reset();
      });
  }

  edit(specialization: DoctorSpecializationDto): void {
    if (specialization.specialityId) {
      this.setSpecializationOptions(specialization.specialityId);
    }

    this.form.patchValue({
      id: specialization.id ?? null,
      specialityId: specialization.specialityId ?? null,
      specializationId: specialization.specializationId ?? null,
      serviceDetails: specialization.serviceDetails ?? '',
      documentName: specialization.documentName ?? '',
    });
  }

  delete(id?: number): void {
    if (!id) {
      return;
    }

    if (!confirm('Delete this specialization?')) {
      return;
    }

    this.doctorSpecializationService.delete(id).subscribe({
      next: () => {
        this.toaster.customToast('Specialization deleted.', 'success');
        this.updated.emit();
        this.resetForm();
      },
      error: (error) =>
        this.toaster.customToast(
          error?.message ?? 'Unable to delete specialization.',
          'error'
        ),
    });
  }

  submit(): void {
    if (!this.doctorId) {
      this.toaster.customToast('Doctor profile missing.', 'error');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const payload: DoctorSpecializationInputDto = {
      id: value.id ?? undefined,
      doctorProfileId: this.doctorId,
      specialityId: this.toNumber(value.specialityId),
      specializationId: this.toNumber(value.specializationId),
      serviceDetails: value.serviceDetails?.trim(),
      documentName: value.documentName?.trim(),
    };

    this.saving = true;
    const request = payload.id
      ? this.doctorSpecializationService.update(payload)
      : this.doctorSpecializationService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.toaster.customToast('Specialization saved.', 'success');
        this.updated.emit();
        this.resetForm();
      },
      error: (error) => {
        this.saving = false;
        this.toaster.customToast(
          error?.message ?? 'Unable to save specialization.',
          'error'
        );
      },
    });
  }

  getSpecialityName(id?: number): string {
    if (!id) {
      return '—';
    }
    return (
      this.specialityOptions.find((item) => item.id === id)?.specialityName ??
      '—'
    );
  }

  getSpecializationName(id?: number): string {
    if (!id) {
      return '—';
    }
    return (
      this.allSpecializations.find((item) => item.id === id)?.specializationName ??
      '—'
    );
  }

  resetForm(): void {
    this.form.reset();
    this.specializationOptions = [];
  }

  private loadSpecialities(): void {
    this.specialityService.getList().subscribe({
      next: (specialities) => (this.specialityOptions = specialities ?? []),
      error: () =>
        this.toaster.customToast(
          'Unable to load specialties right now.',
          'error'
        ),
    });
  }

  private loadAllSpecializations(): void {
    this.specializationService.getList().subscribe({
      next: (list) => {
        this.allSpecializations = list ?? [];
        const specialityId = this.form.get('specialityId')?.value as number | null;
        if (specialityId) {
          this.setSpecializationOptions(specialityId);
        }
      },
      error: () =>
        this.toaster.customToast(
          'Unable to load specialization options.',
          'error'
        ),
    });
  }

  private setSpecializationOptions(specialityId?: number): void {
    if (!specialityId) {
      this.specializationOptions = [];
      return;
    }

    this.specializationOptions = this.allSpecializations.filter(
      (item) => item.specialityId === specialityId
    );
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
