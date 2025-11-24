import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type {
  DoctorChamberDto,
  DoctorScheduleDto,
  DoctorScheduleDaySessionDto,
  DoctorScheduleInputDto,
} from 'src/app/api/dto-models/models';
import { ConsultancyType, consultancyTypeOptions } from 'src/app/api/enums/consultancy-type.enum';
import { ScheduleType, scheduleTypeOptions } from 'src/app/api/enums/schedule-type.enum';
import { DoctorScheduleService } from 'src/app/api/services/doctor-schedule.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { Subscription } from 'rxjs';

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
  sourceSessionId?: number | null;
}

@Component({
  selector: 'app-doctor-schedule-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-schedule-builder.component.html',
  styleUrls: ['./doctor-schedule-builder.component.scss'],
})
export class DoctorScheduleBuilderComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() isOpen = false;
  @Input() doctorId: number | null = null;
  @Input() chambers: DoctorChamberDto[] = [];
  @Input() initialChamberId: number | null = null;
  @Input() chambersLoading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() scheduleCreated = new EventEmitter<DoctorScheduleDto>();

  private readonly fb = inject(FormBuilder);
  private readonly doctorScheduleService = inject(DoctorScheduleService);
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

  sessionDrafts: ScheduleSessionDraft[] = [];
  existingSchedules: DoctorScheduleDto[] = [];
  existingSessionsByDay: Record<DayOfWeek, DoctorScheduleDaySessionDto[]> = this.createEmptySessionsByDay();
  existingScheduleError?: string;

  isSubmitting = false;
  isExistingScheduleLoading = false;

  private readonly selectedDays = new Set<DayOfWeek>();
  private sessionDraftId = 0;
  private editingScheduleId: number | null = null;
  private hasManualDaySelection = false;
  private selectedChamberId: number | null = null;
  private chamberControlSubscription?: Subscription;

  ngOnInit(): void {
    this.chamberControlSubscription = this.scheduleDetailsForm
      .get('doctorChamberId')
      ?.valueChanges.subscribe((value) => {
        this.selectedChamberId = value ?? null;
        if (!this.isOpen) {
          return;
        }

        if (this.canLoadExistingSchedules()) {
          this.loadExistingSchedules();
        } else {
          this.existingSchedules = [];
          this.existingSessionsByDay = this.createEmptySessionsByDay();
          this.syncSelectedDaysFromExistingSessions();
          this.sessionDrafts = [];
          this.sessionDraftId = 0;
          this.hasManualDaySelection = false;
          this.hydrateSessionDraftsFromExistingSchedule();
        }
      });

    this.syncFormState();
  }

  ngOnDestroy(): void {
    this.chamberControlSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorId']) {
      this.syncFormState();
    }

    if (changes['isOpen']) {
      if (this.isOpen) {
        this.applyInitialChamberSelection();
        if (this.canLoadExistingSchedules()) {
          this.loadExistingSchedules();
        }
      } else {
        this.resetBuilderState();
      }
    }

    if (changes['initialChamberId'] && this.isOpen) {
      this.applyInitialChamberSelection();
    }
	if (changes['chambers'] && this.isOpen && !this.selectedChamberId) {
	  this.applyInitialChamberSelection();
	}
  }

  get hasSessions(): boolean {
    return this.sessionDrafts.length > 0;
  }

  get hasSelectedDays(): boolean {
    return this.selectedDays.size > 0;
  }

  get selectedExistingSessionsFlat(): {
    day: DayOfWeek;
    session: DoctorScheduleDaySessionDto;
  }[] {
    if (!this.hasSelectedDays) {
      return [];
    }

    const rows: { day: DayOfWeek; session: DoctorScheduleDaySessionDto }[] = [];

    this.daysOfWeek.forEach(({ value }) => {
      if (!this.selectedDays.has(value)) {
        return;
      }

      const sessionsForDay = this.existingSessionsByDay[value] ?? [];
      sessionsForDay.forEach((session) => {
        rows.push({ day: value, session });
      });
    });

    return rows;
  }

  get selectedChamberName(): string {
    const match = this.chambers.find(
      (chamber) => (chamber.id ?? null) === (this.selectedChamberId ?? null)
    );
    return match?.chamberName ?? 'Select chamber';
  }

  get isEditingExistingSchedule(): boolean {
    return !!this.editingScheduleId;
  }

  dayIsSelected(day: DayOfWeek): boolean {
    return this.selectedDays.has(day);
  }

  toggleDay(day: DayOfWeek, checked: boolean): void {
    if (!this.hasManualDaySelection) {
      this.selectedDays.clear();
      this.hasManualDaySelection = true;
    }

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
    if (!this.doctorId) {
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
    const payloadBase: DoctorScheduleInputDto = {
      doctorProfileId: this.doctorId,
      doctorChamberId: formValue.doctorChamberId ?? undefined,
      scheduleName: formValue.scheduleName?.trim() || undefined,
      scheduleType: formValue.scheduleType,
      consultancyType: formValue.consultancyType,
      isActive: formValue.isActive ?? true,
      offDayFrom: null,
      offDayTo: null,
      doctorScheduleDaySession: this.sessionDrafts.map((session) => ({
        id: session.sourceSessionId ?? undefined,
        scheduleDayofWeek: session.day,
        startTime: session.startTime,
        endTime: session.endTime,
        noOfPatients: session.noOfPatients ?? undefined,
        isActive: true,
      })),
      doctorFeesSetup: [],
    };

    const editingScheduleId = this.editingScheduleId;
    const payload = editingScheduleId
      ? { ...payloadBase, id: editingScheduleId }
      : payloadBase;

    this.isSubmitting = true;
    const request$ = editingScheduleId
      ? this.doctorScheduleService.update(editingScheduleId, payload)
      : this.doctorScheduleService.create(payload);

    request$.subscribe({
      next: (responseSchedule) => {
        this.toaster.customToast(
          editingScheduleId
            ? 'Schedule updated successfully.'
            : 'Schedule saved successfully.',
          'success'
        );
        this.upsertExistingSchedule(responseSchedule);
        this.rebuildExistingSessionsByDay();
        this.scheduleCreated.emit(responseSchedule);
        this.isSubmitting = false;
        this.close();
      },
      error: () => {
        this.isSubmitting = false;
        this.toaster.customToast(
          editingScheduleId
            ? 'Could not update the schedule. Please try again later.'
            : 'Could not save the schedule. Please try again later.',
          'error'
        );
      },
    });
  }

  close(): void {
    this.resetBuilderState();
    this.closed.emit();
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

  private createEmptySessionsByDay(): Record<DayOfWeek, DoctorScheduleDaySessionDto[]> {
    return this.daysOfWeek.reduce(
      (acc, day) => {
        acc[day.value] = [];
        return acc;
      },
      {} as Record<DayOfWeek, DoctorScheduleDaySessionDto[]>
    );
  }

  private rebuildExistingSessionsByDay(): void {
    const lookup = this.createEmptySessionsByDay();

    this.existingSchedules.forEach((schedule) => {
      schedule.doctorScheduleDaySession?.forEach((session) => {
        const normalizedDay = this.normalizeDayOfWeek(
          session.scheduleDayofWeek ?? undefined
        );
        if (!normalizedDay) {
          return;
        }

        lookup[normalizedDay].push(session);
      });
    });

    this.existingSessionsByDay = lookup;
    this.syncSelectedDaysFromExistingSessions();
  }

  private normalizeDayOfWeek(day?: string | null): DayOfWeek | null {
    if (!day) {
      return null;
    }

    const normalized = this.daysOfWeek.find(
      (item) => item.value.toLowerCase() === day.toLowerCase()
    );
    return normalized?.value ?? null;
  }

  private hydrateSessionDraftsFromExistingSchedule(): void {
    const primarySchedule = this.getPrimaryScheduleForEditing();
    this.editingScheduleId = primarySchedule?.id ?? null;
    this.hasManualDaySelection = false;

    if (!primarySchedule) {
      this.editingScheduleId = null;
      return;
    }

    const drafts: ScheduleSessionDraft[] = [];
    this.sessionDraftId = 0;

    primarySchedule.doctorScheduleDaySession?.forEach((session) => {
      const day = this.normalizeDayOfWeek(session.scheduleDayofWeek ?? undefined);
      if (!day || !session.startTime || !session.endTime) {
        return;
      }

      drafts.push({
        id: ++this.sessionDraftId,
        day,
        startTime: session.startTime,
        endTime: session.endTime,
        noOfPatients: session.noOfPatients ?? null,
        sourceSessionId: session.id ?? undefined,
      });
    });

    this.sessionDrafts = drafts;

    this.scheduleDetailsForm.patchValue(
      {
        scheduleName: primarySchedule.scheduleName ?? '',
        scheduleType: primarySchedule.scheduleType ?? ScheduleType.Regular,
        consultancyType:
          primarySchedule.consultancyType ?? ConsultancyType.Chamber,
        isActive: primarySchedule.isActive ?? true,
      },
      { emitEvent: false }
    );
  }

  private getPrimaryScheduleForEditing(): DoctorScheduleDto | null {
    if (!this.existingSchedules.length) {
      return null;
    }

    const activeSchedule = this.existingSchedules.find(
      (schedule) => schedule.isActive !== false
    );

    return activeSchedule ?? this.existingSchedules[0];
  }

  private upsertExistingSchedule(updated: DoctorScheduleDto): void {
    if (!updated.id) {
      this.existingSchedules = [updated, ...this.existingSchedules];
      return;
    }

    const index = this.existingSchedules.findIndex(
      (schedule) => schedule.id === updated.id
    );

    if (index === -1) {
      this.existingSchedules = [updated, ...this.existingSchedules];
      return;
    }

    const collection = [...this.existingSchedules];
    collection[index] = updated;
    this.existingSchedules = collection;
  }

  private syncSelectedDaysFromExistingSessions(): void {
    if (this.hasManualDaySelection) {
      return;
    }

    this.selectedDays.clear();

    this.daysOfWeek.forEach(({ value }) => {
      const sessions = this.existingSessionsByDay[value] ?? [];
      if (sessions.length > 0) {
        this.selectedDays.add(value);
      }
    });
  }

  private syncFormState(): void {
    if (this.doctorId) {
      this.scheduleDetailsForm.enable({ emitEvent: false });
      this.sessionForm.enable({ emitEvent: false });
    } else {
      this.scheduleDetailsForm.disable({ emitEvent: false });
      this.sessionForm.disable({ emitEvent: false });
    }
  }

  private applyInitialChamberSelection(): void {
    const fallback =
      this.initialChamberId ??
      this.scheduleDetailsForm.value.doctorChamberId ??
      this.chambers[0]?.id ??
      null;

    this.scheduleDetailsForm.patchValue(
      {
        doctorChamberId: fallback,
      },
      { emitEvent: true }
    );
  }

  private resetBuilderState(): void {
    this.scheduleDetailsForm.reset({
      doctorChamberId: this.initialChamberId ?? null,
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

    this.sessionDrafts = [];
    this.sessionDraftId = 0;
    this.selectedDays.clear();
    this.hasManualDaySelection = false;
    this.existingSchedules = [];
    this.existingSessionsByDay = this.createEmptySessionsByDay();
    this.syncSelectedDaysFromExistingSessions();
    this.existingScheduleError = undefined;
    this.editingScheduleId = null;
  }

  private canLoadExistingSchedules(): boolean {
    return !!(this.doctorId && this.selectedChamberId);
  }

  private loadExistingSchedules(): void {
    if (!this.canLoadExistingSchedules()) {
      return;
    }

    this.isExistingScheduleLoading = true;
    this.existingScheduleError = undefined;
    this.existingSessionsByDay = this.createEmptySessionsByDay();
    this.hasManualDaySelection = false;
    this.syncSelectedDaysFromExistingSessions();

    this.doctorScheduleService
      .getScheduleDetailsByDoctorAndChamber(
        this.doctorId!,
        this.selectedChamberId!
      )
      .subscribe({
        next: (response) => {
          this.existingSchedules = response ?? [];
          this.hasManualDaySelection = false;
          this.rebuildExistingSessionsByDay();
          this.hydrateSessionDraftsFromExistingSchedule();
          this.isExistingScheduleLoading = false;
        },
        error: () => {
          this.isExistingScheduleLoading = false;
          this.existingSessionsByDay = this.createEmptySessionsByDay();
          this.syncSelectedDaysFromExistingSessions();
          this.editingScheduleId = null;
          this.hasManualDaySelection = false;
          if (this.sessionDrafts.length === 0) {
            this.sessionDraftId = 0;
          }
          this.existingScheduleError =
            'Unable to load existing schedules for this chamber.';
        },
      });
  }

  private isValidTimeRange(start: string, end: string): boolean {
    return start < end;
  }
}

