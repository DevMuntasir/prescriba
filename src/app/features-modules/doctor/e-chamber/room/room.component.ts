import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  SessionPatient,
  getPatientsForSession,
  getSessionById,
  ScheduleSession,
} from '../mock-data';
import { getPatientQueue } from './mock-data';

type PatientStatus = 'waiting' | 'in-consultation' | 'completed';

interface Patient {
  id: string;
  name: string;
  token: string | number;
  age: number;
  gender: string;
  status: PatientStatus;
  arrivalTime: string;       // "HH:mm"
  appointmentTime: string;   // "HH:mm"
}
@Component({
  selector: 'app-e-chamber-room',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private readonly sessionKey = this.route.snapshot.paramMap.get('sessionId') ?? '';
  session: ScheduleSession | undefined = getSessionById(this.sessionKey);
  patients: SessionPatient[] = getPatientsForSession(this.sessionKey);

  constructor(private readonly route: ActivatedRoute) {}


  badgeClasses(status: SessionPatient['status']) {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-amber-100 text-amber-700 border border-amber-200';
    }
  }
    queue: Patient[] = getPatientQueue();
  currentTime: Date = new Date();
  consultationProgress = 0;

  private timeIntervalId: any;
  private progressIntervalId: any;

  ngOnInit(): void {
    // Live clock
    this.timeIntervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // Simulated consultation progress
    this.progressIntervalId = setInterval(() => {
      this.consultationProgress =
        this.consultationProgress >= 100 ? 0 : this.consultationProgress + 1;
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
    if (this.progressIntervalId) {
      clearInterval(this.progressIntervalId);
    }
  }

  get waitingPatients(): Patient[] {
    return this.queue.filter((p) => p.status === 'waiting');
  }

  get inConsultation(): Patient | undefined {
    return this.queue.find((p) => p.status === 'in-consultation');
  }

  get nextPatient(): Patient | undefined {
    return this.waitingPatients[0];
  }

  get waitingCount(): number {
    return this.waitingPatients.length;
  }

  get completedCount(): number {
    return this.queue.filter((p) => p.status === 'completed').length;
  }

  handleCallNext(): void {
    const waitingPatients = this.waitingPatients;
    if (waitingPatients.length > 0 && !this.inConsultation) {
      const nextPatient = waitingPatients[0];
      this.queue = this.queue.map((p) =>
        p.id === nextPatient.id
          ? { ...p, status: 'in-consultation' }
          : p
      );
      this.consultationProgress = 0;
    }
  }

  handleComplete(patientId: string): void {
    this.queue = this.queue.map((p) =>
      p.id === patientId ? { ...p, status: 'completed' } : p
    );
    this.consultationProgress = 0;
  }

  getWaitingTime(arrivalTime: string): number {
    const arrival = new Date();
    const [hours, minutes] = arrivalTime.split(':');
    arrival.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    const diff = Math.floor(
      (this.currentTime.getTime() - arrival.getTime()) / 1000 / 60
    );
    return diff > 0 ? diff : 0;
  }

  // Simple SVG icon helpers (if you ever want to swap icons, you can).
  trackByPatientId(index: number, patient: Patient): string {
    return patient.id;
  }
}
