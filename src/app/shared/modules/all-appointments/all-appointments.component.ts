import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import {
  DataFilterModel,
  DoctorProfileDto,
  DoctorScheduleDto,
  FilterModel,
} from 'src/app/proxy/dto-models';
import { AppointmentType, ConsultancyType } from 'src/app/proxy/enums';
import {
  AppointmentService,
  DoctorScheduleService,
} from 'src/app/proxy/services';
import { SubSink } from 'subsink';
import { CommonService } from '../../services/common.service';
import { FilterInputModel } from '../../utils/models/models';
import { AuthService } from './../../services/auth.service';
import { UserinfoStateService } from './../../services/states/userinfo-state.service';
import { TosterService } from './../../services/toster.service';
import {
  BookingService,
  initBooking,
} from './../dynamic-booking/service/booking.service';

import { MatDialog } from '@angular/material/dialog';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { DynamicBookingComponent } from '../dynamic-booking/dynamic-booking.component';
@Component({
  selector: 'app-all-appointments',
  templateUrl: './all-appointments.component.html',
  styleUrls: ['./all-appointments.component.scss'],
})
export class AllAppointmentsComponent implements OnInit {
  @Input() id!: number;
  @Input() user!: string;
  search!: string;
  @ViewChildren('appointments') appointments!: QueryList<ElementRef>;

  dataLoading: boolean = false;
  appointmentList: any[] = [];
  skelton: boolean = false;

  noDataAvailable!: boolean;
  noDataText = false;
  consultancyType: any = [];
  specialityList: any = [];
  specializationList: any = [];

  totalCount: any = 0;

  filter!: FormGroup;
  filterInput!: FilterInputModel;
  filterModel: FilterModel = {
    offset: 0,
    limit: 0,
    pageNo: 0,
    pageSize: 15,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
  };

  doctorFilterDto: DataFilterModel = {} as DataFilterModel;
  userType: any;
  doctorDetails!: DoctorProfileDto;
  isScheduleChamber!: boolean;
  isScheduleOnline!: boolean;
  scheduleInfo!: DoctorScheduleDto[];
  exportLoader: boolean = false;
  currentFilter!: {
    consultancy: any;
    name: any;
    startDate: any;
    endDate: any;
    appointmentType: any;
    scheduleId: any;
    day: any;
  };
  constructor(
    private fb: FormBuilder,
    private AppointmentService: AppointmentService,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private dialog: MatDialog,
    private UserinfoStateService: UserinfoStateService,
    private DoctorScheduleService: DoctorScheduleService,
    private BookingService: BookingService,
    private TosterService: TosterService
  ) {
    this.filterInput = {
      fields: {
        searchField: {
          formControlName: 'appointmentSearch',
        },
        filterField: [
          {
            label: 'Consultancy Type',
            fieldType: 'select',
            formControlName: 'consultancy',
            options: CommonService.getEnumList(ConsultancyType),
          },
          {
            label: 'Appointment Type',
            fieldType: 'select',
            formControlName: 'appointmentType',
            options: CommonService.getEnumList(AppointmentType),
          },
          {
            label: 'start date',
            fieldType: 'date-range',
            formControlName: {
              startDate: 'startDate',
              endDate: 'endDate',
            },
          },
        ],
      },
    };
    this.filter = this.fb.group({});
  }
  ngOnInit(): void {
    this.userType = this.AuthService.authInfo().userType;
    this.UserinfoStateService.authenticateUserInfo.subscribe((res) => {
      this.doctorDetails = res;
      if (res.id) {
        this.DoctorScheduleService.getDetailsScheduleListByDoctorId(
          res.id
        ).subscribe((scheduleInfo) => {
          this.scheduleInfo = scheduleInfo;
          scheduleInfo?.map((schedule) => {
            if (schedule.consultancyTypeName == 'Chamber') {
              this.isScheduleChamber = true;
            }
            if (schedule.consultancyTypeName == 'Online') {
              this.isScheduleOnline = true;
            }
          });
        });
      }
    });
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      const name = params['apt-patientname']
        ? params['apt-patientname']
        : params['apt-doctorname']
        ? params['apt-doctorname']
        : params['patientname']
        ? params['patientname']
        : params['doctorname'];

      const consultancyType = params['consultancyType'];
      const appointmentType = params['appointmentType'];
      const scheduleId = params['scheduleId'];
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      const day = params['day'];
      this.currentFilter = {
        consultancy: consultancyType,
        name: name,
        startDate: startDate,
        endDate: endDate,
        appointmentType: appointmentType,
        scheduleId: scheduleId,
        day: day,
      };
      if (
        consultancyType ||
        name ||
        startDate ||
        endDate ||
        appointmentType ||
        day ||
        scheduleId
      ) {
        this.loadData(
          {
            consultancy: consultancyType,
            name: name,
            startDate: startDate,
            endDate: endDate,
            appointmentType: appointmentType,
            scheduleId: scheduleId,
            day: day,
          },
          false
        );
      } else {
        this.loadData(
          {
            consultancy: undefined,
            name: undefined,
            endDate: undefined,
            startDate: undefined,
            appointmentType: undefined,
            scheduleId: undefined,
            day: undefined,
          },
          false
        );
      }
    });
  }

  loadData(data: any, isScrolled = false) {
    if (!isScrolled) {
      this.appointmentList = [];
      this.filterModel.pageNo = 1;
    }
    const {
      consultancy,
      startDate,
      endDate,
      name,
      appointmentType,
      scheduleId,
      day,
    } = data;

    let sDate: any =
      startDate !== undefined
        ? new Date(startDate).toLocaleDateString()
        : undefined;
    let eDate: any =
      endDate !== undefined
        ? new Date(endDate).toLocaleDateString()
        : undefined;
    this.doctorFilterDto.consultancyType = consultancy;
    this.doctorFilterDto.fromDate = sDate;
    this.doctorFilterDto.toDate = eDate;
    this.doctorFilterDto.name = name;
    this.doctorFilterDto.appointmentType = appointmentType;
    this.doctorFilterDto.scheduleId = scheduleId;
    this.doctorFilterDto.day = day;

    this.filterModel.limit = this.filterModel.pageSize;
    this.filterModel.offset =
      (this.filterModel.pageNo - 1) * this.filterModel.pageSize;
    this.dataLoading = true;
    this.skelton = true;

    if (this.user == 'doctor') {
      this.AppointmentService.getAppointmentListForDoctorWithSearchFilter(
        this.id,
        this.doctorFilterDto,
        this.filterModel
      ).subscribe({
        next: (res) => {
          this.appointmentList = [...this.appointmentList, ...res.result];
          this.totalCount = res.count;
          this.skelton = false;
          this.dataLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.skelton = false;
          this.dataLoading = false;
        },
      });
    }

    if (this.user == 'patient' || this.user == 'agent') {
      let userType = this.user == 'patient' ? 'patient' : 'agent';
      this.AppointmentService.getAppointmentListForPatientWithSearchFilter(
        this.id,
        userType,
        this.doctorFilterDto,
        this.filterModel
      ).subscribe({
        next: (res) => {
          this.appointmentList = [...this.appointmentList, ...res.result];
          this.totalCount = res.count;
          this.skelton = false;
          this.dataLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.skelton = false;
          this.dataLoading = false;
        },
      });
    }
  }
  onScrollDown() {
    if (this.appointmentList.length >= this.totalCount) return;
    this.filterModel.pageNo++;
    this.loadData(this.currentFilter, true);
  }
  createAppointmentByAssist() {
    this.BookingService.selectedItem.set(initBooking);
    this.dialog.open(DynamicBookingComponent, {
      maxWidth: 600,
      minWidth: 320,
      maxHeight: '100vh',
      disableClose: true,
      data: {
        doctorDetails: {
          ...this.doctorDetails,
        },
        doctorScheduleInfo: this.scheduleInfo,
        userAccess: true,
        isAuthUser: true,
        isSchedule:
          this.isScheduleChamber || this.isScheduleOnline ? true : false,
        isInstant: this.doctorDetails?.isOnline,
        isDoctorSideAppointment: true,
      },
    });
  }

  createAppointmentByAgent() {
    this.BookingService.selectedItem.set(initBooking);
    this.dialog.open(DynamicBookingComponent, {
      maxWidth: 600,
      minWidth: 320,
      maxHeight: '100vh',
      data: {
        doctorDetails: {},
        doctorScheduleInfo: this.scheduleInfo,
        userAccess: true,
        isAuthUser: true,
        isSchedule:
          this.isScheduleChamber || this.isScheduleOnline ? true : false,
        isInstant: this.doctorDetails?.isOnline,
      },
    });
  }

  completeAppointment(aptCode: string) {
    if (aptCode) {
      this.AppointmentService.updateCallConsultationAppointment(
        aptCode
      ).subscribe((res) => {
        if (res) {
          this.loadData({
            consultancy: undefined,
            name: undefined,
            endDate: undefined,
            startDate: undefined,
          });
          this.TosterService.customToast('Appointment Completed!!', 'success');
        }
      });
    }
  }

  cancelAppointment(id: any) {
    let sessionUser = this.AuthService.authInfo();
    if (id) {
      let result = confirm('Are you Sure, to canel this appointment?');
      if (result) {
        this.AppointmentService.cancellAppointment(
          id,
          sessionUser.id,
          sessionUser.userType
        ).subscribe((res) => {
          if (res) {
            this.loadData({
              consultancy: undefined,
              name: undefined,
              endDate: undefined,
              startDate: undefined,
            });
            this.TosterService.customToast(
              'Appointment Cancelled!!',
              'success'
            );
          }
        });
      }
    }
  }

  exportToCSV() {
    this.doctorFilterDto.export = true;
    this.exportLoader = true;
    this.AppointmentService.getAppointmentExportFile(
      Number(this.doctorDetails.id),
      this.doctorFilterDto,
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
}
