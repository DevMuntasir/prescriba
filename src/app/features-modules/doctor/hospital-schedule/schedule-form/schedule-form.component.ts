import { HospitalStateService } from '../../../../shared/services/states/hospital-state.service';
import { DoctorScheduleService } from './../../../../proxy/services/doctor-schedule.service';
import { TosterService } from './../../../../shared/services/toster.service';
// import { DoctorScheduleDto } from './../../../../proxy/dto-models/models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  // AppointmentType,
  ConsultancyType,
  ScheduleType,
} from 'src/app/proxy/enums';
import { DoctorChamberService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';
// import { DoctorScheduleDaySessionDto } from 'src/app/proxy/dto-models';
import { map } from 'rxjs';
import { DoctorChamberDto } from 'src/app/proxy/dto-models';
// import { scheduleData } from 'src/app/shared/utils/input-info';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
})
export class ScheduleFormComponent implements OnInit {
  @Input() openFormComponent!: boolean;
  @Output() rerenderDoctorSchedule: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  form!: FormGroup;
  doctorId: any;
  error!: boolean;
  hospitalOptions: any = [];
  DoctorScheduleDt = [];
  days: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  hideField!: boolean;
  selectedDays: string[] = [];
  consultancyType: any = [];
  scheduleType: any = [];
  allSelectedSession: any = [];
  isDisable: boolean = true;
  isRequired: boolean = false;
  inputConfigs: any = [];
  editData!: any;
  editScheduleId!: number;
  hospitalList: any;
  formSubmitted: boolean = false;
  slotError: boolean = false;
  chamberList!: DoctorChamberDto[];
  constructor(
    private fb: FormBuilder,
    private DoctorChamberService: DoctorChamberService,
    private DoctorScheduleService: DoctorScheduleService,
    private HospitalStateService: HospitalStateService,
    private normalAuth: AuthService,
    private TosterService: TosterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.consultancyType = CommonService.getEnumList(ConsultancyType).filter(
      (c) => c.name !== 'Instant'
    );
    this.scheduleType = CommonService.getEnumList(ScheduleType);
    this.loadForm();
    let authInfo = this.normalAuth.authInfo();
    if (authInfo && authInfo.id) {
      this.doctorId = authInfo.id;
      this.HospitalStateService.getData()
        .pipe(
          map((list) => {
            return list.map((item: any) => ({
              name: item.chamberName,
              id: item.id,
            }));
          })
        )
        .subscribe((hospitalList) => {
          this.hospitalList = hospitalList;
          // this.getInputFieldData()
        });
      this.getChamberList(authInfo.id);
    }
    this.HospitalStateService.getIndividualScheduleInfo().subscribe((res) => {
      this.form.patchValue(res);
      this.allSelectedSession = res.doctorScheduleDaySession;
    });
    //refactor and optimize further
    this.HospitalStateService.getHospitalScheduleFormEvent().subscribe(
      (res) => {
        this.form.reset();
        this.allSelectedSession = [];
      }
    );
    this.HospitalStateService.getIndividualScheduleInfoForEdit().subscribe(
      (res) => {
        if (res.edit && res.id) {
          this.editData = true;
          this.editScheduleId = res.id;
        } else {
          this.editData = false;
          this.editScheduleId = 0;
        }
      }
    );

    this.form.get('consultancyType')?.valueChanges.subscribe((value) => {
      if (value == 1) {
        this.isDisable = false;
        this.form.get('doctorChamberId')?.setValue('0');
      } else {
        this.isDisable = true;
      }
    });
  }

  // getInputFieldData() {
  //   this.inputConfigs = scheduleData(
  //     this.hospitalList,
  //     this.scheduleType,
  //     this.consultancyType
  //   );
  // }

  loadForm() {
    this.form = this.fb.group({
      scheduleType: [0, Validators.required],
      consultancyType: [0, Validators.required],
      doctorChamberId: [0, Validators.required],
      isSlotSelected: [''],
    });
  }
  getChamberList(id: number) {
    this.HospitalStateService.getDoctorScheduleList().subscribe({
      next: (res) => console.log(res),
    });
  }
  toggleDaySelection(day: string) {
    this.openDialog(day);
  }

  submit() {
    const consultencyType = Number(this.form.value.consultancyType);
    const doctorChamberId = Number(this.form.value.doctorChamberId);

    const scheduleType = Number(this.form.value.scheduleType);
    // const isExistChamber = this.chamberList.some(
    //   (chamber) => chamber.id === doctorChamberId
    // );
    // console.log(isExistChamber, this.editData);

    // if (isExistChamber && !this.editData) {
    //   this.TosterService.customToast(
    //     'Chamber Schedule Already Exist. If you want to add session, then edit the existing chamber schedule.',
    //     'warning'
    //   );
    //   return;
    // }
    this.formSubmitted = true;
    if (
      (consultencyType === 2 ||
        consultencyType === 3 ||
        consultencyType === 4) &&
      !scheduleType
    ) {
      this.TosterService.customToast(
        'Please select a schedule type',
        'warning'
      );
      return;
    }

    if (consultencyType === 1 && !doctorChamberId) {
      this.TosterService.customToast(
        'Please select a doctor chamber',
        'warning'
      );
      return;
    }

    if (this.allSelectedSession.length <= 0) {
      this.TosterService.customToast('Please add your session', 'warning');
      return;
    }

    const obj = {
      doctorProfileId: this.doctorId,
      scheduleType: scheduleType,
      consultancyType: consultencyType,
      doctorChamberId: doctorChamberId,
      isActive: true,
      offDayFrom: '2023-08-13T08:27:02.691Z',
      offDayTo: '2023-08-13T08:27:02.691Z',
      doctorScheduleDaySession: this.allSelectedSession.map((e: any) => ({
        id: typeof e.id === 'string' || e.id instanceof String ? 0 : e.id,
        scheduleDayofWeek: e.scheduleDayofWeek,
        startTime: e.startTime,
        endTime: e.endTime,
        noOfPatients: e.noOfPatients,
        isActive: true,
      })),
      doctorFeesSetup: [],
    };

    if (!this.editScheduleId) {
      this.scheduleCreate(obj);
    } else {
      this.scheduleUpdate({ ...obj, id: this.editScheduleId });
    }
  }

  scheduleCreate(obj: any) {
    this.DoctorScheduleService.create(obj).subscribe((res) => {
      this.handleResponse(res);
    });
  }

  scheduleUpdate(obj: any) {
    this.DoctorScheduleService.update(obj).subscribe((res) => {
      this.handleResponse(res);
    });
  }

  handleResponse(res: any) {
    if (res.success === true) {
      this.TosterService.customToast(String(res.message), 'success');
      this.allSelectedSession = [];
      this.form.reset();
      this.HospitalStateService.setHospitalScheduleFormEvent(false);
      this.rerenderDoctorSchedule.emit(true);
    } else if (res.success === false) {
      this.TosterService.customToast(String(res.message), 'error');
    } else {
      this.TosterService.customToast(String(res.message), 'warning');
    }
  }

  getDaySessions(day: string) {
    return this.allSelectedSession.filter(
      (s: any) => s.scheduleDayofWeek === day
    );
  }

  onSessionEdit(day: any, time: any) {
    this.openDialog(day, true, time);
  }

  openDialog(day: string, edit = false, time?: any) {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: { selectedDay: day, title: 'Select Your Session Time', time, edit },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.form.get('isSlotSelected')?.setValue(true);
      result?.appointments.map(
        (e: any) => (this.allSelectedSession = [...this.allSelectedSession, e])
      );
    });
  }

  //should be refactor
  onSessionRemove(id: any) {
    this.DoctorScheduleService.deleteSession(id).subscribe(
      (res) => {
        this.allSelectedSession = this.allSelectedSession.filter(
          (f: any) => f.id !== id
        );
      },
      (error) => {
        this.allSelectedSession = this.allSelectedSession.filter(
          (f: any) => f.id !== id
        );
      }
    );
  }
}
