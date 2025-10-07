import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { DoctorScheduleDto } from 'src/app/proxy/dto-models';
import { DoctorScheduleService } from 'src/app/proxy/services';

@Component({
  selector: 'app-available-day-time',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './available-day-time.component.html',
  styleUrl: './available-day-time.component.scss',
})
export class AvailableDayTimeComponent implements OnChanges {
  @Input() doctorId: number | null = null;
  availableDaysAndTime: { day: string; time: string[] }[] = [];
  scheduleInfo: any;

  constructor(private doctorScheduleService: DoctorScheduleService) {}
  ngOnChanges(): void {
    if (this.doctorId) {
      this.fetchScheduleForDoctor();
    }
  }
  private fetchScheduleForDoctor(): void {
    if (this.doctorId) {
      this.doctorScheduleService
        .getDetailsScheduleListByDoctorId(this.doctorId)
        .subscribe((schedule) => {
          this.scheduleInfo = schedule;
          this.availableDaysAndTime =
            this.getAllAvailableDayForDoctor(schedule);
        });
    }
  }
  getAllAvailableDayForDoctor(schedule: DoctorScheduleDto[]) {
    const daySession = schedule.map((e) => {
      return e.doctorScheduleDaySession.map((day) => {
        return {
          day: day.scheduleDayofWeek,
          time: day.startTime + '-' + day.endTime,
        };
      });
    });
    let flattened = daySession.flat();
    const dayGroups = flattened.reduce(
      (acc, entry) => {
        const { day, time } = entry;
        if (day && time) {
          if (!acc[day as any]) {
            acc[day as any] = acc[day as any] = { day, time: [time] };
          }
          acc[day as any].time.push(time);
        }

        return acc;
      },
      {} as {
        day: string;
        time: string[];
      }[]
    );
    return Object.values(dayGroups);
  }
}
