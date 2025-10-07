import { convertTo12HourFormat } from 'src/app/shared/utils/timeFormater';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { AppointmentDto } from 'src/app/proxy/dto-models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-appointment-card.component.html',
  styleUrl: './list-appointment-card.component.scss',
})
export class ListAppointmentCardComponent {
  @Input() details: AppointmentDto = {} as AppointmentDto;
  @Input() type = 'online';
  convertTo12HourFormat = convertTo12HourFormat;
  private Router = inject(Router);
  joinCall(apt: AppointmentDto, user: string) {
    let username =
      user == 'agent' || user == 'patient' ? apt.patientName : apt.doctorName;
    const client = user;
    const aptId = apt.id;
    const aptCode = apt.appointmentCode;

    if (username && client && aptCode && aptId) {
      this.updateQueryParam({
        username: username,
        client: client,
        aptCode: aptCode,
        aptId: aptId,
      });
    }
  }
  updateQueryParam(params: {
    username: string;
    client: string;
    aptCode: string;
    aptId: number;
  }) {
    let route = 'video-consultation';
    this.Router.navigate([`${route}`], {
      queryParams: params,
    });
  }

  formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
