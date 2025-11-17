import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Appointment {
  serial: string;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  appointmentDate: string;
  status: string;
}

@Component({
  selector: 'app-appointments',
  // standalone: true,
  // imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
  private readonly fb = inject(FormBuilder);

  appointments: Appointment[] = [
    {
      serial: 'AP-001',
      patientName: 'Rahim Uddin',
      age: 42,
      gender: 'Male',
      contactNumber: '01711-234567',
      appointmentDate: '23 Oct 2025, 10:30 AM',
      status: 'Confirmed',
    },
    {
      serial: 'AP-002',
      patientName: 'Mita Akter',
      age: 31,
      gender: 'Female',
      contactNumber: '01922-765432',
      appointmentDate: '23 Oct 2025, 11:15 AM',
      status: 'Confirmed',
    },
    {
      serial: 'AP-003',
      patientName: 'Kamal Hossain',
      age: 55,
      gender: 'Male',
      contactNumber: '01818-998877',
      appointmentDate: '23 Oct 2025, 12:00 PM',
      status: 'Checked In',
    },
    {
      serial: 'AP-004',
      patientName: 'Nazma Begum',
      age: 47,
      gender: 'Female',
      contactNumber: '01616-554433',
      appointmentDate: '23 Oct 2025, 01:30 PM',
      status: 'Pending',
    },
  ];

  readonly appointmentForm = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.maxLength(80)]],
    age: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(120)],
    ],
    gender: ['Male', Validators.required],
    contactNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9+\-\s]{6,20}$/)],
    ],
  });

  lastGeneratedSerial: string | null = null;
  isFormOpen = false;
  private serialCounter = 5;

  openForm(): void {
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.appointmentForm.reset({
      gender: 'Male',
    });
  }

  submitAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const serial = this.generateSerial();
    const formValue = this.appointmentForm.getRawValue();
    const newAppointment: Appointment = {
      serial,
      patientName: formValue.patientName,
      age: formValue.age ?? 0,
      gender: formValue.gender,
      contactNumber: formValue.contactNumber,
      appointmentDate: new Date().toLocaleString(),
      status: 'Pending',
    };

    this.appointments = [...this.appointments, newAppointment];
    this.lastGeneratedSerial = serial;
    this.closeForm();
  }

  trackBySerial(_index: number, appointment: Appointment): string {
    return appointment.serial;
  }

  private generateSerial(): string {
    const serial = `AP-${this.serialCounter.toString().padStart(3, '0')}`;
    this.serialCounter += 1;
    return serial;
  }
}
