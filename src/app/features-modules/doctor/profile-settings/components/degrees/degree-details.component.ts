import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DegreeDto, DoctorDegreeDto } from 'src/app/api/dto-models';
import { DoctorDegreeInputDto } from 'src/app/api/input-dto';
import {
  DegreeService,
  DoctorDegreeService,
} from 'src/app/api/services';
import { TosterService } from 'src/app/shared/services/toster.service';

@Component({
  selector: 'app-doctor-degree-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './degree-details.component.html',
  styleUrls: ['./degree-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorDegreeDetailsComponent implements OnInit, OnChanges {
  @Input() doctorId: number | null = null;
  @Input() degrees: DoctorDegreeDto[] | null = [];
  @Output() updated = new EventEmitter<void>();

  degreeOptions: DegreeDto[] = [];
  saving = false;
  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private degreeService: DegreeService,
    private doctorDegreeService: DoctorDegreeService,
    private toaster: TosterService
  ) {
    this.form = this.fb.group({
      id: [null],
      degreeId: [null, Validators.required],
      duration: [null, [Validators.min(1), Validators.max(20)]],
      durationType: [''],
      passingYear: [
        null,
        [
          Validators.required,
          Validators.min(1950),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
      instituteName: ['', [Validators.required, Validators.maxLength(120)]],
      instituteCity: [''],
      instituteCountry: [''],
      zipCode: [''],
    });
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorId'] && !this.doctorId) {
      this.resetForm();
    }
  }

  editDegree(degree: DoctorDegreeDto): void {
    this.form.patchValue({
      id: degree.id ?? null,
      degreeId: degree.degreeId ?? null,
      duration: degree.duration ?? null,
      durationType: degree.durationType ?? '',
      passingYear: degree.passingYear ?? null,
      instituteName: degree.instituteName ?? '',
      instituteCity: degree.instituteCity ?? '',
      instituteCountry: degree.instituteCountry ?? '',
      zipCode: degree.zipCode ?? '',
    });
  }

  deleteDegree(id?: number): void {
    if (!id) {
      return;
    }

    if (!confirm('Delete this degree entry?')) {
      return;
    }

    this.doctorDegreeService.delete(id).subscribe({
      next: () => {
        this.toaster.customToast('Degree deleted.', 'success');
        this.updated.emit();
        this.resetForm();
      },
      error: (error) =>
        this.toaster.customToast(
          error?.message ?? 'Unable to delete the degree.',
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
    const payload: DoctorDegreeInputDto = {
      id: value.id ?? undefined,
      doctorProfileId: this.doctorId,
      degreeId: this.toNumber(value.degreeId),
      duration: this.toNumber(value.duration),
      durationType: value.durationType?.trim() || undefined,
      passingYear: this.toNumber(value.passingYear),
      instituteName: value.instituteName?.trim(),
      instituteCity: value.instituteCity?.trim(),
      instituteCountry: value.instituteCountry?.trim(),
      zipCode: value.zipCode?.trim(),
    };

    this.saving = true;
    const request = payload.id
      ? this.doctorDegreeService.update(payload)
      : this.doctorDegreeService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.toaster.customToast('Degree saved.', 'success');
        this.updated.emit();
        this.resetForm();
      },
      error: (error) => {
        this.saving = false;
        this.toaster.customToast(
          error?.message ?? 'Unable to save degree, try again.',
          'error'
        );
      },
    });
  }

  getDegreeName(id?: number): string {
    if (!id) {
      return '—';
    }
    return (
      this.degreeOptions.find((degree) => degree.id === id)?.degreeName ?? '—'
    );
  }

  resetForm(): void {
    this.form.reset();
  }

  private loadOptions(): void {
    this.degreeService.getList().subscribe({
      next: (degrees) => (this.degreeOptions = degrees ?? []),
      error: () =>
        this.toaster.customToast(
          'Unable to load degree options right now.',
          'error'
        ),
    });
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
