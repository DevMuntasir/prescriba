import { Component, inject, OnInit } from '@angular/core';
import {
  DoctorProfileDto
} from 'src/app/proxy/dto-models';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private UserService = inject(UserinfoStateService);
  authenticatedUserDetails: DoctorProfileDto = {} as DoctorProfileDto;
  authInfo: any;
  ngOnInit(): void {
    this.UserService.authenticateUserInfo.subscribe((res) => {
      this.authenticatedUserDetails = res;
    });
  }
}
