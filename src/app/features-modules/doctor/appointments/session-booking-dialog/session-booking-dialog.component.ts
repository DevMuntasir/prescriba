import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentService, CreateAppointmentPayload } from 'src/app/api';
import { ScheduleSessionView } from '../appointments.component';

export interface SessionBookingDialogData {
  scheduleId?: number;
  sessionId?: number | string;
  appointmentDate: string;
  scheduleName?: string;
  sessionTimeLabel?: string;
}

export interface SessionBookingDialogResult {
  scheduleId?: number;
  sessionId?: number | string;
  appointmentDate: string;
  patientName: string;
  gender: string;
  age: number;
  phone: string;
  bloodGroup: string;
}

@Component({
  selector: 'app-session-booking-dialog',
  templateUrl: './session-booking-dialog.component.html',
  styleUrls: ['./session-booking-dialog.component.scss'],

})
export class SessionBookingDialogComponent {
  private readonly fb = inject(FormBuilder);
  isSuccessAppointmentCreate: boolean = false
  readonly bookingForm = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.maxLength(80)]],
    age: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(120)],
    ],
    gender: ['Male', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^[0-9+\-\s]{6,20}$/)],
    ],
    bloodGroup: ['', Validators.maxLength(5)],
  });
  isCreatingAppointment = false;
  appointmentCreationError?: string;
  private readonly appointmentService = inject(AppointmentService);

  readonly todayDate = this.formatDateInput(new Date());
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: SessionBookingDialogData,
    private readonly dialogRef: MatDialogRef<SessionBookingDialogComponent>
  ) { }

  submit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    debugger
    const value = this.bookingForm.getRawValue();

    const payload: SessionBookingDialogResult = {
      scheduleId: this.data.scheduleId,
      sessionId: this.data.sessionId,
      appointmentDate: this.data.appointmentDate,
      patientName: value.patientName,
      gender: value.gender,
      age: value.age ?? 0,
      phone: value.phone,
      bloodGroup: value.bloodGroup ?? '',
    };
    if (this.data.sessionId) {
      this.createAppointmentFromDialogResult(this.data, payload)
    }


  }
  private buildAppointmentDateIso(date: string, startTime?: string): string {
    const safeDate = date || this.todayDate;
    const [hour = '00', minute = '00'] = (startTime ?? '00:00').split(':');
    const normalizedHour = hour.padStart(2, '0');
    const normalizedMinute = minute.padStart(2, '0');
    const candidate = new Date(
      `${safeDate}T${normalizedHour}:${normalizedMinute}:00`
    );

    if (Number.isNaN(candidate.getTime())) {
      return new Date().toISOString();
    }

    return candidate.toISOString();
  }
  private toNumber(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  private createAppointmentFromDialogResult(
    session: ScheduleSessionView,
    result: SessionBookingDialogResult
  ): void {
    const scheduleId = this.toNumber(result.scheduleId ?? session.scheduleId);
    const sessionId = this.toNumber(result.sessionId ?? session.id);

    if (!scheduleId || !sessionId) {
      this.appointmentCreationError =
        'Missing schedule information. Please refresh and try again.';
      return;
    }

    const appointmentDateIso = this.buildAppointmentDateIso(
      result.appointmentDate,
      session.startTime
    );
    debugger
    const payload: CreateAppointmentPayload = {
      patientName: result.patientName.trim(),
      gender: result.gender,
      age: result.age ?? 0,
      phoneNumber: result.phone,
      sessionId,
      bloodGroup: result.bloodGroup?.trim().toUpperCase() ?? '',
      scheduleId,
      appointmentDate: appointmentDateIso,
    };

    this.isCreatingAppointment = true;
    this.appointmentCreationError = undefined;

    this.appointmentService.createAppointment(payload).subscribe({
      next: (created) => {
        this.isSuccessAppointmentCreate = true
        this.isCreatingAppointment = false;
        // this.dialogRef.close(payload);
      },
      error: () => {
        this.isCreatingAppointment = false;
        this.appointmentCreationError =
          'Unable to create appointment right now. Please try again.';
      },
    });
  }
  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  close(): void {
    this.dialogRef.close();
  }
}
