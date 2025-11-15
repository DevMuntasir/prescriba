import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type {
  DoctorChamberDto,
  DoctorScheduleDto,
  DoctorScheduleInputDto,
} from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import { DoctorScheduleService } from 'src/app/api/services/doctor-schedule.service';
import {
  ConsultancyType,
  consultancyTypeOptions,
} from 'src/app/api/enums/consultancy-type.enum';
import {
  ScheduleType,
  scheduleTypeOptions,
} from 'src/app/api/enums/schedule-type.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';

type DayOfWeek =
  | 'Saturday'
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';

interface ScheduleSessionDraft {
  id: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  noOfPatients?: number | null;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly doctorScheduleService = inject(DoctorScheduleService);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(TosterService);

  readonly scheduleTypeChoices = scheduleTypeOptions;
  readonly consultancyTypeChoices = consultancyTypeOptions;

  readonly scheduleDetailsForm = this.fb.nonNullable.group({
    doctorChamberId: [null as number | null, Validators.required],
    scheduleName: ['', [Validators.maxLength(150)]],
    scheduleType: [ScheduleType.Regular, Validators.required],
    consultancyType: [ConsultancyType.Chamber, Validators.required],
    isActive: [true],
  });

  readonly sessionForm = this.fb.nonNullable.group({
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    noOfPatients: [
      null as number | null,
      [Validators.min(1), Validators.max(999)],
    ],
  });

  readonly daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: 'Saturday', label: 'Sat' },
    { value: 'Sunday', label: 'Sun' },
    { value: 'Monday', label: 'Mon' },
    { value: 'Tuesday', label: 'Tue' },
    { value: 'Wednesday', label: 'Wed' },
    { value: 'Thursday', label: 'Thu' },
    { value: 'Friday', label: 'Fri' },
  ];

  private readonly selectedDays = new Set<DayOfWeek>();
  private sessionDraftId = 0;

  sessionDrafts: ScheduleSessionDraft[] = [];
  chambers: DoctorChamberDto[] = [];
  schedules: DoctorScheduleDto[] = [];
  activeChamberId: number | null = null;

  isLoadingChambers = false;
  isLoadingSchedules = false;
  isSubmitting = false;
  loadError?: string;
  scheduleLoadError?: string;

  private doctorProfileId: number | null = null;

  ngOnInit(): void {
    const authInfo = this.authService.authInfo();
    this.doctorProfileId = authInfo?.id ?? null;

    if (!this.doctorProfileId) {
      this.scheduleDetailsForm.disable();
      this.sessionForm.disable();
      this.loadError =
        'Doctor profile not found. Please sign in again to manage schedules.';
      return;
    }

    this.fetchChambers();
    this.fetchSchedules();
  }

  get hasSessions(): boolean {
    return this.sessionDrafts.length > 0;
  }

  get hasSchedules(): boolean {
    return this.schedules.length > 0;
  }

  get activeChamberSchedules(): DoctorScheduleDto[] {
    return this.getSchedulesByChamberId(this.activeChamberId ?? undefined);
  }

  dayIsSelected(day: DayOfWeek): boolean {
    return this.selectedDays.has(day);
  }

  setActiveChamber(chamberId: number | null): void {
    this.activeChamberId = chamberId ?? null;
    if (chamberId === null || chamberId === undefined) {
      return;
    }
    this.scheduleDetailsForm.patchValue({
      doctorChamberId: chamberId,
    });
  }

  isActiveChamber(chamberId: number | null | undefined): boolean {
    if (chamberId === undefined) {
      return false;
    }
    return (this.activeChamberId ?? null) === (chamberId ?? null);
  }

  toggleDay(day: DayOfWeek, checked: boolean): void {
    if (checked) {
      this.selectedDays.add(day);
    } else {
      this.selectedDays.delete(day);
    }
  }

  addSession(): void {
    if (this.selectedDays.size === 0) {
      this.toaster.customToast(
        'Select at least one day before adding a session.',
        'warning'
      );
      return;
    }

    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    const { startTime, endTime, noOfPatients } = this.sessionForm.value;
    if (!startTime || !endTime) {
      return;
    }

    if (!this.isValidTimeRange(startTime, endTime)) {
      this.toaster.customToast(
        'Start time must be earlier than end time.',
        'warning'
      );
      return;
    }

    const duplicates: DayOfWeek[] = [];

    this.selectedDays.forEach((day) => {
      const hasDuplicate = this.sessionDrafts.some(
        (session) =>
          session.day === day &&
          session.startTime === startTime &&
          session.endTime === endTime
      );

      if (hasDuplicate) {
        duplicates.push(day);
        return;
      }

      this.sessionDrafts = [
        ...this.sessionDrafts,
        {
          id: ++this.sessionDraftId,
          day,
          startTime,
          endTime,
          noOfPatients: noOfPatients ?? null,
        },
      ];
    });

    if (duplicates.length > 0) {
      this.toaster.customToast(
        `A session with the same time already exists for: ${duplicates.join(
          ', '
        )}.`,
        'warning'
      );
    }

    this.sessionForm.reset({
      startTime: '',
      endTime: '',
      noOfPatients: null,
    });
    this.selectedDays.clear();
  }

  removeSession(sessionId: number): void {
    this.sessionDrafts = this.sessionDrafts.filter(
      (session) => session.id !== sessionId
    );
  }

  saveSchedule(): void {
    if (!this.doctorProfileId) {
      this.toaster.customToast(
        'Doctor profile not found. Please sign in again and try.',
        'error'
      );
      return;
    }

    if (this.scheduleDetailsForm.invalid) {
      this.scheduleDetailsForm.markAllAsTouched();
      return;
    }

    if (!this.hasSessions) {
      this.toaster.customToast(
        'Add at least one session to the schedule.',
        'warning'
      );
      return;
    }

    const formValue = this.scheduleDetailsForm.getRawValue();
    const payload: DoctorScheduleInputDto = {
      doctorProfileId: this.doctorProfileId,
      doctorChamberId: formValue.doctorChamberId ?? undefined,
      scheduleName: formValue.scheduleName?.trim() || undefined,
      scheduleType: formValue.scheduleType,
      consultancyType: formValue.consultancyType,
      isActive: formValue.isActive ?? true,
      offDayFrom: null,
  offDayTo: null,

      doctorScheduleDaySession: this.sessionDrafts.map((session) => ({
        scheduleDayofWeek: session.day,
        startTime: session.startTime,
        endTime: session.endTime,
        noOfPatients: session.noOfPatients ?? undefined,
        isActive: true,
      })),
      doctorFeesSetup: [],
    };

    this.isSubmitting = true;
    this.doctorScheduleService.create(payload).subscribe({
      next: (createdSchedule) => {
        this.toaster.customToast('Schedule saved successfully.', 'success');
        this.schedules = [createdSchedule, ...this.schedules];
        this.resetFormsAfterSave();
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        this.toaster.customToast(
          'Could not save the schedule. Please try again later.',
          'error'
        );
      },
    });
  }

  refreshSchedules(): void {
    this.fetchSchedules(true);
  }

  getSchedulesByChamberId(chamberId: number | undefined): DoctorScheduleDto[] {
    if (!chamberId) {
      return [];
    }

    return this.schedules.filter(
      (schedule) => schedule.doctorChamberId === chamberId
    );
  }

  formatTimeLabel(time: string | undefined): string {
    if (!time) {
      return '';
    }

    const [hourStr, minuteStr] = time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return time;
    }
    const period = hour >= 12 ? 'PM' : 'AM';
    const normalizedHour = hour % 12 || 12;
    const paddedMinute = minute.toString().padStart(2, '0');
    return `${normalizedHour}:${paddedMinute} ${period}`;
  }

  getDayLabel(day: string | undefined): string {
    if (!day) {
      return '';
    }
    const match = this.daysOfWeek.find(
      (item) => item.value.toLowerCase() === day.toLowerCase()
    );
    return match?.label ?? day;
  }

  private fetchChambers(): void {
    if (!this.doctorProfileId) {
      return;
    }

    this.isLoadingChambers = true;
    this.loadError = undefined;

    this.doctorChamberService
      .getListByDoctorId(this.doctorProfileId)
      .subscribe({
        next: (response) => {
          this.chambers = response ?? [];
          this.isLoadingChambers = false;
          if (this.chambers.length > 0) {
            const fallbackId =
              this.scheduleDetailsForm.value.doctorChamberId ??
              this.activeChamberId ??
              this.chambers[0].id ??
              null;
            this.setActiveChamber(fallbackId);
          }
        },
        error: () => {
          this.isLoadingChambers = false;
          this.loadError =
            'Could not load chamber information. Please try again later.';
        },
      });
  }

  private fetchSchedules(force = false): void {
    if (!this.doctorProfileId) {
      return;
    }

    if (!force && this.isLoadingSchedules) {
      return;
    }

    this.isLoadingSchedules = true;
    this.scheduleLoadError = undefined;

    this.doctorScheduleService
      .getListByDoctorIdList(this.doctorProfileId)
      .subscribe({
        next: (response) => {
          this.schedules = response ?? [];
          this.isLoadingSchedules = false;
        },
        error: () => {
          this.isLoadingSchedules = false;
          this.scheduleLoadError =
            'Could not load schedules. Please try again later.';
        },
      });
  }

  private resetFormsAfterSave(): void {
    const selectedChamber =
      this.activeChamberId ?? this.scheduleDetailsForm.value.doctorChamberId ?? null;

    this.scheduleDetailsForm.reset({
      doctorChamberId: selectedChamber,
      scheduleName: '',
      scheduleType: ScheduleType.Regular,
      consultancyType: ConsultancyType.Chamber,
      isActive: true,
    });

    this.sessionForm.reset({
      startTime: '',
      endTime: '',
      noOfPatients: null,
    });

    this.selectedDays.clear();
    this.sessionDrafts = [];
    this.sessionDraftId = 0;
  }

  private isValidTimeRange(start: string, end: string): boolean {
    return start < end;
  }
}
