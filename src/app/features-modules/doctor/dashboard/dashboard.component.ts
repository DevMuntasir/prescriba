import { Component, inject, OnInit } from '@angular/core';
import {
  AppointmentDto,
  DashboardStateDto,
  DataFilterModel,
  DoctorProfileDto,
  FilterModel,
} from 'src/app/proxy/dto-models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { DashboardService } from './../../../proxy/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private UserService = inject(UserinfoStateService);
  private NormalAuth = inject(AuthService);
  private DashboardService = inject(DashboardService);
  authenticatedUserDetails: DoctorProfileDto = {} as DoctorProfileDto;
  warning = false;
  showWarning: boolean = false;
  details: DashboardStateDto = {} as DashboardStateDto;
  doctorId: any;
  appointmentList: AppointmentDto[] = [];
  onlineAptLoader: boolean = false;
  chamberAptLoader: boolean = false;
  authInfo: any;

  myDate = new Date();

  selectedOnlineValue = 'completed';
  selectedChamberValue = 'completed';
  filterModel: FilterModel = {
    pageNo: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    limit: 0,
    isDesc: false,
    offset: 0,
  };
  filterData: DataFilterModel = {} as DataFilterModel;
  onlineTabLabels = ['today', 'completed'];
  chamberTabLabels = ['today', 'completed'];

  onlineAppointmentCache: { [key: string]: any[] } = {};
  chamberAppointmentCache: { [key: string]: any[] } = {};
  selectedIndex = 1;
  selectedChamberIndex = 1;
  exportLoader: boolean = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.showWarning = true;
    }, 1000);

    this.UserService.authenticateUserInfo.subscribe((res) => {
      this.authenticatedUserDetails = res;
    });
    this.authInfo = this.NormalAuth.authInfo();
  }

  getDashboardStatisticData(id: number) {
    this.DashboardService.getDashboadDataForDoctor(id).subscribe({
      next: (res) => {
        this.details = res;
      },
    });
  }
}
