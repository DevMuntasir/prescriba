import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import type {
  AppointmentDto,
  AppointmentInputDto,
  DoctorChamberDto,
  DoctorScheduleDto,
} from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import { DoctorScheduleService } from 'src/app/api/services/doctor-schedule.service';
import { AppointmentService, CreateAppointmentPayload } from 'src/app/api/services/appointment.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  SessionBookingDialogComponent,
  SessionBookingDialogResult,
} from './session-booking-dialog/session-booking-dialog.component';

export interface Appointment {
  serial: string;
  patientName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  appointmentDate: string;
  status: string;
}

export interface ScheduleSessionView {
  id?: number | string;
  scheduleId?: number;
  startTime?: string;
  endTime?: string;
  noOfPatients?: number;
  scheduleName?: string;
  scheduleTypeName?: string;
  consultancyTypeName?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-appointments',
  // If you want standalone, uncomment these:
  // standalone: true,
  // imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly doctorScheduleService = inject(DoctorScheduleService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  chambers: DoctorChamberDto[] = [];
  isLoadingChambers = false;
  chamberLoadError?: string;
  private doctorProfileId: number | null = null;

  selectedChamberId: number | null = null;
  schedules: DoctorScheduleDto[] = [];
  isLoadingSchedules = false;
  scheduleLoadError?: string;
  selectedWeekDay: string | null = null;
  selectedBookingDate: string | null = null;
  bookingDateError?: string;

  isLoadingAppointments = false;
  appointmentsLoadError?: string;


  readonly todayDate = this.formatDateInput(new Date());

  readonly weekDays = [
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
  ];

  private readonly dayKeyToIndex: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  private readonly dayIndexToKey: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  appointments: Appointment[] = [];

  readonly appointmentForm = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.maxLength(80)]],
    age: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(120)],
    ],
    gender: ['Male', Validators.required],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9+\-\s]{6,20}$/)],
    ],
  });

  lastGeneratedSerial: string | null = null;
  isFormOpen = false;

  /** start after your 004 seed */
  private serialCounter = 5;

  constructor() {
    const authInfo = this.authService.authInfo();
    this.doctorProfileId = authInfo?.id ?? null;

    if (!this.doctorProfileId) {
      this.chamberLoadError =
        'Doctor profile not found. Please log in again to view your hospitals.';
    }
  }

  ngOnInit(): void {
    if (this.doctorProfileId) {
      this.loadDoctorChambers(this.doctorProfileId);
    }

    this.fetchAppointments();
  }

  openForm(): void {
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.appointmentForm.reset({
      gender: 'Male',
    });
    this.selectedChamberId = null;
    this.schedules = [];
    this.selectedWeekDay = null;
    this.selectedBookingDate = null;
    this.bookingDateError = undefined;

    this.bookingDateError = undefined;
  }

 
  

  trackBySerial(_index: number, appointment: Appointment): string {
    return appointment.serial;
  }

  trackByChamber(index: number, chamber: DoctorChamberDto): number {
    return chamber.id ?? index;
  }

  get selectedChamber(): DoctorChamberDto | undefined {
    if (this.selectedChamberId === null) {
      return undefined;
    }
    return this.chambers.find((ch) => ch.id === this.selectedChamberId);
  }

  isChamberSelected(chamberId: number | null | undefined): boolean {
    if (chamberId === undefined) return false;
    return (this.selectedChamberId ?? null) === (chamberId ?? null);
  }

  onChamberSelected(chamber: DoctorChamberDto): void {
    const chamberId = chamber.id ?? null;
    if (!chamberId || !this.doctorProfileId) return;

    this.selectedChamberId = chamberId;
    this.loadSchedulesForChamber(chamberId);
  }

  hasSessionsForDay(dayKey: string): boolean {
    if (!dayKey) return false;

    return this.schedules.some((schedule) =>
      (schedule.doctorScheduleDaySession ?? []).some(
        (session) => this.normalizeDay(session.scheduleDayofWeek) === dayKey
      )
    );
  }

  selectWeekDay(dayKey: string): void {
    if (!dayKey) return;

    if (this.hasSessionsForDay(dayKey)) {
      this.selectedWeekDay = dayKey;
      this.bookingDateError = undefined;
      this.ensureBookingDateForDay(dayKey);
    }
  }

  handleBookingDateChange(value: string): void {
    if (!value) {
      this.selectedBookingDate = null;
      this.bookingDateError = undefined;
      return;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      this.bookingDateError = 'Please choose a valid date.';
      this.selectedBookingDate = null;
      return;
    }

    const dayKey = this.getDayKeyFromDate(parsed);
    if (!this.hasSessionsForDay(dayKey)) {
      this.bookingDateError =
        'This chamber has no sessions on the selected date. Pick another day.';
      this.selectedBookingDate = null;
      return;
    }

    this.selectedWeekDay = dayKey;
    this.selectedBookingDate = this.formatDateInput(parsed);
    this.bookingDateError = undefined;
  }

  get sessionsForSelectedDay(): ScheduleSessionView[] {
    if (!this.selectedWeekDay) return [];
    return this.getSessionsForDay(this.selectedWeekDay);
  }

  trackBySession(index: number, session: ScheduleSessionView): number | string {
    // FIX: previously broken template string
    return session.id ?? `${session.scheduleName ?? 'session'}-${index}`;
  }

  formatTimeLabel(time: string | undefined): string {
    if (!time) return '';

    const [hourStr, minuteStr] = time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return time;
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const normalizedHour = hour % 12 || 12;
    const paddedMinute = minute.toString().padStart(2, '0');

    // FIX: return complete formatted label
    return `${normalizedHour}:${paddedMinute} ${period}`;
  }

  getDayLabel(day: string | undefined): string {
    if (!day) return '';

    const normalized = this.normalizeDay(day);
    const match = this.weekDays.find((w) => w.key === normalized);
    return match?.label ?? day;
  }

  openSessionBooking(session: ScheduleSessionView): void {
    if (!this.selectedBookingDate) {
      this.bookingDateError =
        'Choose a date for the appointment before continuing.';
      return;
    }

    const dialogRef = this.dialog.open(SessionBookingDialogComponent, {
      width: '480px',
      data: {
        scheduleId: session.scheduleId,
        sessionId: session.id,
        appointmentDate: this.selectedBookingDate,
        scheduleName: session.scheduleName,
        sessionTimeLabel: `${this.formatTimeLabel(
          session.startTime
        )} - ${this.formatTimeLabel(session.endTime)}`,
      },
    });

   

    dialogRef.afterClosed().subscribe((result?: SessionBookingDialogResult) => {
      if (!result) return;

    //call all apt funtion
    });
  }

  onSessionKeydown(event: KeyboardEvent, session: ScheduleSessionView): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openSessionBooking(session);
    }
  }







 

  private fetchAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentsLoadError = undefined;

    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        const normalized = response ?? [];
        this.appointments = normalized?.results?.map((dto) =>
          this.mapAppointmentDto(dto)
        );
        this.isLoadingAppointments = false;
      },
      error: () => {
        this.isLoadingAppointments = false;
        this.appointmentsLoadError =
          'Unable to load appointments right now. Please try again later.';
      },
    });
  }

  private mapAppointmentDto(dto: AppointmentDto): Appointment {
    return {
      serial: dto.appointmentSerial?.toString() ?? 0,
      patientName: dto.patientName ?? 'Unknown patient',
      age: dto.patientAge ?? 0,
      gender: dto.gender ?? 'N/A',
      phoneNumber: dto.phoneNumber ?? 'N/A',
      appointmentDate: this.formatAppointmentDisplay(dto.appointmentDate),
      status: 
        dto.status ??
        dto.responseMessage ??
        (dto.responseSuccess === false ? 'Failed' : 'Pending'),
    };
  }

  private loadDoctorChambers(doctorId: number): void {
    this.isLoadingChambers = true;
    this.chamberLoadError = undefined;

    this.doctorChamberService.getListByDoctorId(doctorId).subscribe({
      next: (response) => {
        this.chambers = response ?? [];
        this.isLoadingChambers = false;

        // keep selection valid
        if (
          this.selectedChamberId &&
          !this.chambers.some((c) => c.id === this.selectedChamberId)
        ) {
          this.selectedChamberId = null;
          this.schedules = [];
          this.selectedWeekDay = null;
          this.selectedBookingDate = null;
        }
      },
      error: () => {
        this.isLoadingChambers = false;
        this.chamberLoadError =
          'Unable to load hospitals at the moment. Please try again.';
      },
    });
  }

  private loadSchedulesForChamber(chamberId: number): void {
    if (!this.doctorProfileId) return;

    this.isLoadingSchedules = true;
    this.scheduleLoadError = undefined;
    this.selectedWeekDay = null;
    this.selectedBookingDate = null;
    this.schedules = [];

    this.doctorScheduleService
      .getScheduleDetailsByDoctorAndChamber(this.doctorProfileId, chamberId)
      .subscribe({
        next: (response) => {
          this.schedules = response ?? [];
          this.isLoadingSchedules = false;

          this.selectedWeekDay = this.determineInitialWeekDay(this.schedules);

          // FIX: only ensure booking date if day exists
          this.ensureBookingDateForDay(this.selectedWeekDay);
        },
        error: () => {
          this.isLoadingSchedules = false;
          this.scheduleLoadError =
            'Unable to load schedules for this hospital right now. Please try again in a moment.';
        },
      });
  }

  private ensureBookingDateForDay(dayKey: string | null): void {
    if (!dayKey) {
      this.selectedBookingDate = null;
      return;
    }

    const startDate = this.selectedBookingDate
      ? new Date(this.selectedBookingDate)
      : new Date();

    const nextDate = this.findNextDateForDay(dayKey, startDate);
    this.selectedBookingDate = nextDate ?? null;
  }

  private getSessionsForDay(dayKey: string | null): ScheduleSessionView[] {
    if (!dayKey) return [];

    const sessions: ScheduleSessionView[] = [];

    for (const schedule of this.schedules) {
      const daySessions = schedule.doctorScheduleDaySession ?? [];
      for (const session of daySessions) {
        if (this.normalizeDay(session.scheduleDayofWeek) === dayKey) {
          sessions.push({
            id: session.id ?? undefined,
            scheduleId: schedule.id ?? undefined,
            startTime: session.startTime,
            endTime: session.endTime,
            noOfPatients: session.noOfPatients,
            scheduleName: schedule.scheduleName,

            // FIX: parentheses around "as string"
            scheduleTypeName:
              (schedule.scheduleTypeName as string) ?? schedule.scheduleType,

            consultancyTypeName:
              (schedule.consultancyTypeName as string) ??
              schedule.consultancyType,

            isActive: schedule.isActive !== false,
          });
        }
      }
    }

    return sessions.sort((a, b) => {
      const timeA = a.startTime ?? '';
      const timeB = b.startTime ?? '';
      return timeA.localeCompare(timeB);
    });
  }

  private determineInitialWeekDay(
    schedules: DoctorScheduleDto[]
  ): string | null {
    for (const schedule of schedules) {
      const sessions = schedule.doctorScheduleDaySession ?? [];
      for (const session of sessions) {
        const normalized = this.normalizeDay(session.scheduleDayofWeek);
        if (normalized) return normalized;
      }
    }
    return null;
  }

  private normalizeDay(day?: string | null): string | null {
    if (!day) return null;
    return day.trim().toLowerCase();
  }

  private getDayKeyFromDate(date: Date): string {
    return this.dayIndexToKey[date.getDay()];
  }

  private findNextDateForDay(
    dayKey: string,
    referenceDate: Date
  ): string | null {
    const normalizedDay = dayKey.toLowerCase();
    const desiredIndex = this.dayKeyToIndex[normalizedDay];

    if (desiredIndex === undefined) return null;

    const start = new Date(referenceDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i += 1) {
      const candidate = new Date(start);
      candidate.setDate(start.getDate() + i);

      if (candidate.getDay() === desiredIndex) {
        return this.formatDateInput(candidate);
      }
    }

    return null;
  }

  private formatAppointmentDisplay(value: string | undefined | null): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString();
  }
 public formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

