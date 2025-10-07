import { AppointmentService } from './../../../proxy/services/appointment.service';
import { Component, inject, OnInit } from '@angular/core';
import {
  AppointmentDto,
  DashboardStateDto,
  DataFilterModel,
  DoctorProfileDto,
  FilterModel,
} from 'src/app/proxy/dto-models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from './../../../proxy/services/dashboard.service';
import { DoctorScheduleService } from './../../../proxy/services/doctor-schedule.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private UserService = inject(UserinfoStateService);
  private NormalAuth = inject(AuthService);
  private DashboardService = inject(DashboardService);
  private DoctorScheduleService = inject(DoctorScheduleService);
  private AppointmentService = inject(AppointmentService);

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
    const authId = this.authInfo?.id;

    if (authId) {
      this.doctorId = authId;
      this.getDashboardStatisticData(authId);
      this.loadOnlineAppointmentsForTab(this.selectedOnlineValue);
      this.loadOnChamberAppointmentsForTab(this.selectedChamberValue);
      this.DoctorScheduleService.getScheduleListByDoctorId(authId).subscribe({
        next: (res) => {
          this.warning = res == null;
        },
      });
    }
  }

  onChangeTab(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    const tab = this.onlineTabLabels[event.index];
    if (!this.onlineAppointmentCache[tab]) {
      this.loadOnlineAppointmentsForTab(tab);
    }
  }
  onChamberChangeTab(event: MatTabChangeEvent) {
    this.selectedChamberIndex = event.index;
    const tab = this.chamberTabLabels[event.index];

    if (!this.chamberAppointmentCache[tab]) {
      this.loadOnChamberAppointmentsForTab(tab);
    }
  }
  get currentOnlineAppointments(): any[] {
    const currentTab = this.onlineTabLabels[this.selectedIndex];
    return this.onlineAppointmentCache[currentTab] || [];
  }

  get currentChamberAppointments(): any[] {
    const currentTab = this.chamberTabLabels[this.selectedChamberIndex];
    return this.chamberAppointmentCache[currentTab] || [];
  }

  refreshOnlineTab() {
    const currentTab = this.onlineTabLabels[this.selectedIndex];
    this.loadOnlineAppointmentsForTab(currentTab, true);
  }

  refreshChamberTab() {
    const currentTab = this.chamberTabLabels[this.selectedIndex];
    this.loadOnChamberAppointmentsForTab(currentTab, true);
  }

  loadOnlineAppointmentsForTab(tab: string, forceRefresh: boolean = false) {
    if (!forceRefresh && this.onlineAppointmentCache[tab]) return;

    this.onlineAptLoader = true;

    this.DashboardService.getDashboardAppointmentListForDoctor(
      this.doctorId,
      tab
    ).subscribe({
      next: (res) => {
        this.onlineAppointmentCache[tab] = res.result || [];
        this.onlineAptLoader = false;
      },
      error: (err) => {
        console.error(err);
        this.onlineAptLoader = false;
      },
    });
  }

  loadOnChamberAppointmentsForTab(tab: string, forceRefresh: boolean = false) {
    if (!forceRefresh && this.chamberAppointmentCache[tab]) return;
    this.filterData.day = tab;
    this.filterData.consultancyType = 1;
    this.filterData.export = true;
    this.chamberAptLoader = true;

    this.AppointmentService.getAppointmentListForDoctorWithSearchFilter(
      this.doctorId,
      this.filterData,
      this.filterModel
    ).subscribe({
      next: (res) => {
        this.chamberAppointmentCache[tab] = res.result || [];
        this.chamberAptLoader = false;
      },
      error: (err) => {
        console.error(err);
        this.chamberAptLoader = false;
      },
    });
  }
  exportToCSV() {
    this.exportLoader = true;
    this.AppointmentService.getAppointmentExportFile(
      this.doctorId,
      this.filterData,
      this.filterModel
    ).subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'text/xlsx' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'appointments.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
        this.exportLoader = false;
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.exportLoader = false;
      },
    });
  }
  getDashboardStatisticData(id: number) {
    this.DashboardService.getDashboadDataForDoctor(id).subscribe({
      next: (res) => {
        this.details = res;
      },
    });
  }

  // getDashboardChamberAppointment(value: string) {
  //   this.aptLoading = true;
  //   this.DashboardService.getDashboardAppointmentListForDoctor(
  //     this.doctorId,

  //     value
  //   ).subscribe({
  //     next: (res) => {
  //       this.appointmentList = res;
  //       this.aptLoading = false;
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.aptLoading = false;
  //     },
  //   });
  // }
}
