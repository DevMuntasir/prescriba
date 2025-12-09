import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  DoctorSpecializationDto,
  SpecializationDto,
} from 'src/app/api/dto-models';
import { DoctorSpecializationInputDto } from 'src/app/api/input-dto';
import {
  DoctorSpecializationService,
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
export class DoctorSpecializationDetailsComponent implements OnChanges {
  @Input() doctorId: number | null = null;
  @Input() specializations: DoctorSpecializationDto[] | null = [];
  @Input() specialityId: number | null = 5;

  @Output() updated = new EventEmitter<void>();

  specializationOptions: SpecializationDto[] = [];
  saving = false;

  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService,
    private doctorSpecializationService: DoctorSpecializationService,
    private toaster: TosterService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [null],
      specializationId: [null, Validators.required],
      serviceDetails: [''],
      documentName: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['specialityId']) {
      this.form.get('specializationId')?.reset();
      this.loadAllSpecializations(this.specialityId);
    }
console.log(this.specializations);

    if (changes['specializations']) {
      this.setInitialSpecializationSelection();
    }
  }

  edit(specialization: DoctorSpecializationDto): void {
    this.form.patchValue({
      id: specialization.id ?? null,
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

    if (!this.specialityId) {
      this.toaster.customToast('Speciality information is missing.', 'error');
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
      specialityId: this.toNumber(this.specialityId),
      specializationId: this.toNumber(value.specializationId),
      serviceDetails: value.serviceDetails?.trim(),
      documentName: value.documentName?.trim(),
      isDeleted: false,
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

  resetForm(): void {
    this.form.reset();
    this.setInitialSpecializationSelection();
  }

  private loadAllSpecializations(specialityId?: number | null): void {
    const id = this.toNumber(specialityId) ?? 4;
    if (!id) {
      this.specializationOptions = [];
      return;
    }

    this.specializationService.getListBySpecialtyId(id).subscribe({
      next: (list) => {
        this.specializationOptions = list ?? [];
        this.form.get('specializationId')?.setValue(3);
        this.setInitialSpecializationSelection();
        this.cdr.markForCheck();
      },
      error: () =>
        this.toaster.customToast(
          'Unable to load specialization options.',
          'error'
        ),
    });
  }

  private setInitialSpecializationSelection(): void {
    const specializationControl = this.form.get('specializationId');
    if (!specializationControl || specializationControl.value) {
      return;
    }

    if (this.form.get('id')?.value) {
      return;
    }

    const initial = this.specializations?.find(
      (item) => !!item?.specializationId
    );

    if (initial?.specializationId) {
      specializationControl.setValue(initial.specializationId);
      this.cdr.markForCheck();
    }
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
