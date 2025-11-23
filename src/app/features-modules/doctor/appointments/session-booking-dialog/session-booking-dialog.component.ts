import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: SessionBookingDialogData,
    private readonly dialogRef: MatDialogRef<SessionBookingDialogComponent>
  ) {}

  submit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

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

    this.dialogRef.close(payload);
  }

  close(): void {
    this.dialogRef.close();
  }
}
