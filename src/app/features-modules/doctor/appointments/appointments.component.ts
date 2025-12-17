import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
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
  DoctorScheduleDaySessionDto,
  DoctorScheduleDto,
  ExtendedAppointmentDto,
} from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import { DoctorScheduleService } from 'src/app/api/services/doctor-schedule.service';
import { AppointmentService, AppointmentListQuery, CreateAppointmentPayload } from 'src/app/api/services/appointment.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { map, Subject, Subscription, takeUntil } from 'rxjs';
import {
  SessionBookingDialogComponent,
  SessionBookingDialogResult,
} from './session-booking-dialog/session-booking-dialog.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// export interface AppointmentDto {
//   id?: number | string;
//   serialNo: string;
//   patientName: string;
//   age: number;
//   gender: string;
//   phoneNumber: string;
//   appointmentDate: string;
//   status: string;
// }

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
export class AppointmentsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly doctorScheduleService = inject(DoctorScheduleService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();
  private sessionOptionsSub?: Subscription;

  private readonly defaultPageNumber = 1;
  private readonly defaultPageSize = 10;

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


  readonly appointmentFiltersForm = this.fb.group({
    search: [''],
    scheduleId: [null as number | null],
    sessionId: [null as number | null],
    pageNumber: [this.defaultPageNumber],
    pageSize: [this.defaultPageSize],
  });

  private currentAppointmentFilters: AppointmentListQuery = {
    pageNumber: this.defaultPageNumber,
    pageSize: this.defaultPageSize,
  };

  filterScheduleOptions: { id: number; label: string }[] = [];
  filterSessionOptions: { id: number; label: string }[] = [];
  private filterSchedules: DoctorScheduleDto[] = [];

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

  appointments: AppointmentDto[] = [];

  readonly appointmentForm = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.maxLength(80)]],
    patientAge: [
      null as string | null,
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
    const doctorProfileId = this.doctorProfileId;

    this.initializeFilterSync();

    if (doctorProfileId) {
      this.loadDoctorChambers(doctorProfileId);
      this.loadFilterSchedules(doctorProfileId);
    }
  }

  ngOnDestroy(): void {
    this.sessionOptionsSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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




  applyAppointmentFilters(): void {
    // Ensure page number and page size are valid positive integers
    const rawPageNumber = this.appointmentFiltersForm.value.pageNumber;
    const rawPageSize = this.appointmentFiltersForm.value.pageSize;

    const validPageNumber = this.toPositiveNumber(rawPageNumber) ?? this.defaultPageNumber;
    const validPageSize = this.toPositiveNumber(rawPageSize) ?? this.defaultPageSize;

    // Update form with validated values
    this.appointmentFiltersForm.patchValue(
      {
        pageNumber: validPageNumber,
        pageSize: validPageSize,
      },
      { emitEvent: false }
    );

    const filters = this.buildFiltersFromForm();
    this.updateUrlQueryParams(filters);
  }

  resetAppointmentFilters(): void {
    this.appointmentFiltersForm.reset({
      search: '',
      scheduleId: null,
      sessionId: null,
      pageNumber: this.defaultPageNumber,
      pageSize: this.defaultPageSize,
    });
    this.filterSessionOptions = [];
    this.updateUrlQueryParams({
      pageNumber: this.defaultPageNumber,
      pageSize: this.defaultPageSize,
    });
  }

  goToPage(pageNumber: number): void {
    if (pageNumber < 1) return;

    this.appointmentFiltersForm.patchValue(
      { pageNumber },
      { emitEvent: false }
    );

    const filters = this.buildFiltersFromForm();
    this.updateUrlQueryParams(filters);
  }

  changePageSize(pageSize: number): void {
    if (pageSize < 1) return;

    this.appointmentFiltersForm.patchValue(
      {
        pageSize,
        pageNumber: this.defaultPageNumber // Reset to first page when changing page size
      },
      { emitEvent: false }
    );

    const filters = this.buildFiltersFromForm();
    this.updateUrlQueryParams(filters);
  }

  private initializeFilterSync(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      const filters = this.extractFiltersFromParams(paramMap);
      this.currentAppointmentFilters = filters;
      this.patchAppointmentFiltersForm(filters);
      this.fetchAppointments(filters);
    });

    this.appointmentFiltersForm
      .get('scheduleId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const scheduleId = this.toPositiveNumber(value) ?? null;
        this.appointmentFiltersForm.patchValue(
          { sessionId: null },
          { emitEvent: false }
        );
        this.rebuildSessionOptions(scheduleId, null);
      });
  }

  private extractFiltersFromParams(paramMap: ParamMap): AppointmentListQuery {
    const search = paramMap.get('search') ?? undefined;
    const scheduleId = this.toPositiveNumber(paramMap.get('scheduleId'));
    const sessionId = this.toPositiveNumber(paramMap.get('sessionId'));
    const pageNumber =
      this.toPositiveNumber(paramMap.get('pageNumber')) ?? this.defaultPageNumber;
    const pageSize =
      this.toPositiveNumber(paramMap.get('pageSize')) ?? this.defaultPageSize;

    return {
      search: search?.trim() ? search.trim() : undefined,
      scheduleId,
      sessionId,
      pageNumber,
      pageSize,
    };
  }

  private patchAppointmentFiltersForm(filters: AppointmentListQuery): void {
    this.appointmentFiltersForm.patchValue(
      {
        search: filters.search ?? '',
        scheduleId: filters.scheduleId ?? null,
        sessionId: filters.sessionId ?? null,
        pageNumber: filters.pageNumber ?? this.defaultPageNumber,
        pageSize: filters.pageSize ?? this.defaultPageSize,
      },
      { emitEvent: false }
    );

    this.rebuildSessionOptions(filters.scheduleId ?? null, filters.sessionId ?? null);
  }

  private buildFiltersFromForm(): AppointmentListQuery {
    const { search, scheduleId, sessionId, pageNumber, pageSize } =
      this.appointmentFiltersForm.value;

    return {
      search: search?.trim() ? search.trim() : undefined,
      scheduleId: this.toPositiveNumber(scheduleId),
      sessionId: this.toPositiveNumber(sessionId),
      pageNumber: this.toPositiveNumber(pageNumber) ?? this.defaultPageNumber,
      pageSize: this.toPositiveNumber(pageSize) ?? this.defaultPageSize,
    };
  }

  private updateUrlQueryParams(filters: AppointmentListQuery): void {
    const queryParams: Params = {
      pageNumber: filters.pageNumber ?? this.defaultPageNumber,
      pageSize: filters.pageSize ?? this.defaultPageSize,
    };

    if (filters.search) {
      queryParams['search'] = filters.search;
    }

    if (filters.scheduleId) {
      queryParams['scheduleId'] = filters.scheduleId;
    }

    if (filters.sessionId) {
      queryParams['sessionId'] = filters.sessionId;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  private toPositiveNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return undefined;
    }

    return parsed;
  }

  private rebuildSessionOptions(
    scheduleId: number | null,
    desiredSessionId: number | null
  ): void {
    if (!scheduleId) {
      this.sessionOptionsSub?.unsubscribe();
      this.filterSessionOptions = [];
      if (this.appointmentFiltersForm.value.sessionId !== null) {
        this.appointmentFiltersForm.patchValue(
          { sessionId: null },
          { emitEvent: false }
        );
      }
      return;
    }

    this.buildSessionOptions(scheduleId, desiredSessionId);
  }

  private buildSessionOptions(
    scheduleId: number,
    desiredSessionId: number | null
  ): void {
    this.sessionOptionsSub?.unsubscribe();
    this.filterSessionOptions = [];

    this.sessionOptionsSub = this.appointmentService
      .getAppointmentSessionList()
      .pipe(
        takeUntil(this.destroy$),
        map((response) =>
          this.normalizeSessionResponse(response)
            .filter((item) => item.doctorScheduleId === scheduleId)
            .map((session) => ({
              id: session.id as number,
              label: this.buildSessionLabel(session),
            }))
        )
      )
      .subscribe({
        next: (sessions) => {
          this.filterSessionOptions = sessions;
          if (
            desiredSessionId &&
            !sessions.some((option) => option.id === desiredSessionId)
          ) {
            this.appointmentFiltersForm.patchValue(
              { sessionId: null },
              { emitEvent: false }
            );
          }
        },
        error: (err) => {
          console.error('Failed to load sessions', err);
          this.filterSessionOptions = [];
          this.appointmentFiltersForm.patchValue(
            { sessionId: null },
            { emitEvent: false }
          );
        },
      });
  }

  private normalizeSessionResponse(response: any): DoctorScheduleDaySessionDto[] {
    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.results)) {
      return response.results;
    }

    if (Array.isArray(response.result)) {
      return response.result;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.items)) {
      return response.items;
    }

    return [];
  }

  private buildSessionLabel(session: DoctorScheduleDaySessionDto): string {
    const dayLabel = this.getDayLabel(session.scheduleDayofWeek) || 'Session';
    const start = this.formatTimeLabel(session.startTime);
    const end = this.formatTimeLabel(session.endTime);
    const timeLabel = start && end ? `${start} - ${end}` : start ?? end ?? '';
    return `${dayLabel} ${timeLabel}`.trim();
  }




  trackBySerial(_index: number, appointment: AppointmentDto): string {
    return appointment.appointmentId?.toString() ?? '';
  }

  trackByChamber(index: number, chamber: DoctorChamberDto): number {
    return chamber.id ?? index;
  }

  get selectedChamber(): DoctorChamberDto | undefined {
    debugger
    if (this.selectedChamberId === null) {
      return undefined;
    }
    console.log(this.chambers.find((ch) => ch.id === this.selectedChamberId));

    return this.chambers.find((ch) => ch.id === this.selectedChamberId);
  }

  isChamberSelected(chamberId: number | null | undefined): boolean {
    console.log(chamberId, this.selectedChamberId);
    
    if (chamberId === undefined) return false;
    return (this.selectedChamberId ?? null) === (chamberId ?? null);
  }

  onChamberSelected(chamber: DoctorChamberDto): void {
console.log(chamber);

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
        doctorProfileId: this.doctorProfileId,
        sessionTimeLabel: `${this.formatTimeLabel(
          session.startTime
        )} - ${this.formatTimeLabel(session.endTime)}`,
      },
    });



    dialogRef.afterClosed().subscribe((result?: SessionBookingDialogResult) => {
      if (!result) return;

      this.fetchAppointments(this.currentAppointmentFilters);
    });
  }

  onSessionKeydown(event: KeyboardEvent, session: ScheduleSessionView): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openSessionBooking(session);
    }
  }

downloadPDF(): void {
  const doc = new jsPDF();

  const chamber =
    this.selectedChamber ??
    this.getChamberFromFilters();

  const chamberName = chamber?.chamberName || 'All Chambers';
  const address = chamber?.address || '';

  // Determine session time label
  let sessionTime = 'All Sessions';
  if (this.appointmentFiltersForm.value.sessionId) {
    const selectedSession = this.filterSessionOptions.find(
      (s) => s.id === this.appointmentFiltersForm.value.sessionId
    );
    if (selectedSession) sessionTime = selectedSession.label;
  }

  const patientCount = this.appointments.length;
  const date = this.selectedBookingDate
    ? new Date(this.selectedBookingDate).toLocaleDateString()
    : new Date().toLocaleDateString();

  // ---------------- HEADER (UPDATED) ----------------
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;

  // Top band
  doc.setFillColor(16, 185, 129); // emerald
  doc.rect(0, 0, pageWidth, 22, 'F');

  // Chamber name centered in white
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(chamberName, pageWidth / 2, 14, { align: 'center' });

  // Address (centered, muted) below band
  let headerY = 30;
  if (address) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90); // gray
    doc.text(address, pageWidth / 2, headerY, { align: 'center' });
    headerY += 6;
  }

  // Info block background (light tint)
  const infoTop = headerY + 2;
  const infoHeight = 22;
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(marginX, infoTop, pageWidth - marginX * 2, infoHeight, 2, 2, 'F');

  // Info rows
  const labelX = marginX + 4;
  const valueX = pageWidth - marginX - 4;

  doc.setFontSize(11);
  doc.setTextColor(40);

  const row1Y = infoTop + 7;
  const row2Y = infoTop + 14;
  const row3Y = infoTop + 21;

  doc.setFont('helvetica', 'bold');
  doc.text('Session:', labelX, row1Y);
  doc.text('Date:', labelX, row2Y);
  doc.text('Total Patients:', labelX, row3Y);

  doc.setFont('helvetica', 'normal');
  doc.text(sessionTime, valueX, row1Y, { align: 'right' });
  doc.text(date, valueX, row2Y, { align: 'right' });
  doc.text(String(patientCount), valueX, row3Y, { align: 'right' });

  // Divider line before table
  const tableStartY = infoTop + infoHeight + 8;
  doc.setDrawColor(220);
  doc.line(marginX, tableStartY - 4, pageWidth - marginX, tableStartY - 4);
  // --------------------------------------------------

  // --- Table Section ---
  const columns = [
    { header: 'Serial', dataKey: 'serial' },
    { header: 'Patient Name', dataKey: 'name' },
    { header: 'Age', dataKey: 'age' },
    { header: 'Gender', dataKey: 'gender' },
    { header: 'Contact', dataKey: 'contact' },
    { header: 'Status', dataKey: 'status' },
  ];

  const data = this.appointments.map((apt) => ({
    serial: apt.serialNo,
    name: apt.patientName,
    age: apt.patientAge,
    gender: apt.gender,
    contact: apt.phoneNumber,
    status: apt.status,
  }));

  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => row[c.dataKey as keyof typeof row])),
    startY: tableStartY,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 10, cellPadding: 3 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });

  doc.save(`appointments_${new Date().getTime()}.pdf`);
}

private getChamberFromFilters(): DoctorChamberDto | undefined {
  debugger
  const scheduleId = this.currentAppointmentFilters.scheduleId;
  if (!scheduleId) return undefined;

  const schedule = this.filterSchedules.find(s => s.id === scheduleId);
  const chamberId = this.toPositiveNumber(schedule?.doctorChamberId); // adjust field name
  if (!chamberId) return undefined;

  return this.chambers.find(c => this.toPositiveNumber(c.id) === chamberId);
}








  private fetchAppointments(filters?: AppointmentListQuery): void {
    const doctorProfileId = this.doctorProfileId;
    if (!doctorProfileId) {
      return;
    }

    this.isLoadingAppointments = true;
    this.appointmentsLoadError = undefined;

    const effectiveFilters = filters ?? this.currentAppointmentFilters;
    const query: AppointmentListQuery = {
      pageNumber: effectiveFilters.pageNumber ?? this.defaultPageNumber,
      pageSize: effectiveFilters.pageSize ?? this.defaultPageSize,
      search: effectiveFilters.search,
      scheduleId: effectiveFilters.scheduleId,
      sessionId: effectiveFilters.sessionId,
    };

    this.appointmentService.getAppointments(doctorProfileId, query).subscribe({
      next: (response) => {
        const normalized = this.normalizeAppointmentsResponse(response);

        this.appointments = normalized.map((dto) =>
          this.mapAppointmentDto(dto)
        );
        this.isLoadingAppointments = false;
      },
      error: () => {
        this.isLoadingAppointments = false;
        this.appointments = [];
        this.appointmentsLoadError =
          'Unable to load appointments right now. Please try again later.';
      },
    });
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

  private loadFilterSchedules(doctorProfileId: number): void {
    this.doctorScheduleService.getListByDoctorIdList(doctorProfileId).subscribe({
      next: (response) => {
        this.filterSchedules = response ?? [];
        this.filterScheduleOptions = this.filterSchedules
          .filter((schedule) => typeof schedule.id === 'number')
          .map((schedule) => ({
            id: schedule.id as number,
            label:
              schedule.scheduleName ??
              schedule.chamber ??
              `Schedule #${schedule.id}`,
          }));

        this.rebuildSessionOptions(
          this.appointmentFiltersForm.value.scheduleId ?? null,
          this.appointmentFiltersForm.value.sessionId ?? null
        );
      },
      error: () => {
        this.filterSchedules = [];
        this.filterScheduleOptions = [];
        this.filterSessionOptions = [];
      },
    });
  }

  private loadSchedulesForChamber(chamberId: number): void {
    const doctorProfileId = this.doctorProfileId;
    if (!doctorProfileId) return;

    this.isLoadingSchedules = true;
    this.scheduleLoadError = undefined;
    this.selectedWeekDay = null;
    this.selectedBookingDate = null;
    this.schedules = [];

    this.doctorScheduleService
      .getScheduleDetailsByDoctorAndChamber(doctorProfileId, chamberId)
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

  private normalizeAppointmentsResponse(response: any): AppointmentDto[] {
    if (!response) {
      return [];
    }

    // If response has a result property that's an array, use that (ExtendedAppointmentDto)
    if (response.result && Array.isArray(response.result)) {
      return response.result;
    }

    // If response is already an array, return it
    if (Array.isArray(response)) {
      return response;
    }

    // If response has a data property that's an array, use that
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // If response has items property that's an array, use that
    if (response.items && Array.isArray(response.items)) {
      return response.items;
    }

    // Otherwise return empty array
    return [];
  }

  private mapAppointmentDto(dto: AppointmentDto): AppointmentDto {
    // The DTO is already in the correct format, just return it
    return dto;
  }
}
