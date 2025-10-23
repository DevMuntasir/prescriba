import { Component, inject, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { DoctorProfileDto } from 'src/app/api/dto-models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';

@Component({
  selector: 'app-welcome-header',
  standalone: true,
  imports: [],
  templateUrl: './welcome-header.component.html',
  styleUrl: './welcome-header.component.scss',
})
export class WelcomeHeaderComponent {
  @Input() userInfo: DoctorProfileDto = {} as DoctorProfileDto;
  date = new Date();
  formattedDateToday = format(this.date, 'do MMMM yyyy, EEEE');
}
