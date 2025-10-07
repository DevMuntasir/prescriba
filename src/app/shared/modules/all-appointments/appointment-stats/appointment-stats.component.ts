import { Component, inject, OnInit } from '@angular/core';
import { AppointmentStateDto } from 'src/app/proxy/dto-models';
import { AppointmentService, DashboardService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-appointment-stats',
  standalone: true,
  imports: [],
  templateUrl: './appointment-stats.component.html',
  styleUrl: './appointment-stats.component.scss',
})
export class AppointmentStatsComponent implements OnInit {
  private AppointmentService = inject(AppointmentService);
  private AuthService = inject(AuthService);
  states: AppointmentStateDto = {} as AppointmentStateDto;
  isLoading: boolean = false;
  ngOnInit(): void {
    let user = this.AuthService.authInfo();
    if (user.userType == 'doctor') {
      this.getAppointmentStatsForDoctor(user.id);
    } else {
      this.getAppointmentStatsForPatientAndAgent(user.id);
    }
  }
  getAppointmentStatsForDoctor(id: number) {
    this.isLoading = true;
    this.AppointmentService.getAppointmentStateForDoctor(id).subscribe({
      next: (res) => {
        this.states = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching appointment stats:', err);
      },
    });
  }
  getAppointmentStatsForPatientAndAgent(id: number) {
    let user = this.AuthService.authInfo()?.userType;
    this.AppointmentService.getAppointmentStateForPatient(id, user).subscribe({
      next: (res) => {
        this.states = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching appointment stats:', err);
      },
    });
  }
}
