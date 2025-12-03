import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input } from '@angular/core';
import type {
  DoctorChamberDto,
  DoctorScheduleDto,
} from 'src/app/api/dto-models/models';
import { DoctorChamberService } from 'src/app/api/services/doctor-chamber.service';
import { DoctorScheduleService } from 'src/app/api/services/doctor-schedule.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DoctorScheduleBuilderComponent } from '../hospital/schedule-builder/doctor-schedule-builder.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, DoctorScheduleBuilderComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() embedded = false;
  private readonly doctorChamberService = inject(DoctorChamberService);
  private readonly doctorScheduleService = inject(DoctorScheduleService);
  private readonly authService = inject(AuthService);

  private readonly dayLabelMap: Record<string, string> = {
    saturday: 'Sat',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
  };

  chambers: DoctorChamberDto[] = [];
  schedules: DoctorScheduleDto[] = [];
  activeChamberId: number | null = null;

  isLoadingChambers = false;
  isLoadingSchedules = false;
  loadError?: string;
  scheduleLoadError?: string;

  doctorProfileId: number | null = null;

  isBuilderOpen = false;
  builderInitialChamberId: number | null = null;

  ngOnInit(): void {
    const authInfo = this.authService.authInfo();
    this.doctorProfileId = authInfo?.id ?? null;

    if (!this.doctorProfileId) {
      this.loadError =
        'Doctor profile not found. Please sign in again to manage schedules.';
      return;
    }

    this.fetchChambers();
    this.fetchSchedules();
  }

  get hasSchedules(): boolean {
    return this.schedules.length > 0;
  }

  get activeChamberSchedules(): DoctorScheduleDto[] {
    return this.getSchedulesByChamberId(this.activeChamberId ?? undefined);
  }

  setActiveChamber(chamberId: number | null): void {
    this.activeChamberId = chamberId ?? null;
  }

  isActiveChamber(chamberId: number | null | undefined): boolean {
    if (chamberId === undefined) {
      return false;
    }
    return (this.activeChamberId ?? null) === (chamberId ?? null);
  }

  openBuilderSheet(chamberId?: number | null): void {
    if (!this.doctorProfileId || this.chambers.length === 0) {
      return;
    }

    const fallback =
      chamberId ?? this.activeChamberId ?? this.chambers[0].id ?? null;
    this.builderInitialChamberId = fallback;
    this.isBuilderOpen = true;
  }

  handleBuilderClosed(): void {
    this.isBuilderOpen = false;
  }

  handleScheduleCreated(schedule: DoctorScheduleDto): void {
    this.schedules = [schedule, ...this.schedules];
    this.isBuilderOpen = false;
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

    const key = day.toLowerCase();
    return this.dayLabelMap[key] ?? day;
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
          if (this.chambers.length > 0 && this.activeChamberId === null) {
            this.activeChamberId = this.chambers[0].id ?? null;
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
}




