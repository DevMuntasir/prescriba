import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoctorScheduleDto } from 'src/app/api/dto-models';
import { HospitalStateService } from '../../../../shared/services/states/hospital-state.service';
import { DoctorScheduleService } from './../../../../api/services/doctor-schedule.service';
import { AuthService } from './../../../../shared/services/auth.service';
// import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-info',
  templateUrl: './schedule-info.component.html',
  styleUrls: ['./schedule-info.component.scss'],
})
export class ScheduleInfoComponent implements OnInit {
  scheduleList: DoctorScheduleDto[] = [];
  doctorId: any;
  openFormComponent!: boolean;
  scheduleValue!: DoctorScheduleDto;
  editFormComponent: any;
  clickView: any;

  constructor(
    public dialog: MatDialog,
    // private HospitalStateService :HospitalStateService
    private DoctorScheduleService: DoctorScheduleService,
    private NormalAuth: AuthService,
    private HospitalStateService: HospitalStateService
  ) {}

  ngOnInit(): void {
    let authInfo = this.NormalAuth.authInfo();
    if (authInfo && authInfo.id) {
      this.doctorId = authInfo.id;
      this.getScheduleList(authInfo.id);
    }
    this.getScheduleFormEventStatus();
  }

  getScheduleList(id: number): void {
    this.DoctorScheduleService.getListByDoctorIdList(id).subscribe((res) => {
      if (res) {
        this.scheduleList = res;
        console.log(res);

        let list = res.map((e) => {
          return { name: e.scheduleTypeName, id: e.id };
        });
        this.HospitalStateService.setDoctorScheduleList(list);
      }
    });
  }

  getScheduleFormEventStatus() {
    this.HospitalStateService.getHospitalScheduleFormEvent().subscribe(
      (res: boolean) => (this.openFormComponent = res)
    );
    this.HospitalStateService.getIndividualScheduleInfoForEdit().subscribe(
      (res: any) => (this.editFormComponent = res.edit)
    );
  }

  openForm(): void {
    if (this.editFormComponent) {
      this.HospitalStateService.setHospitalScheduleFormEvent(true);
      this.HospitalStateService.setIndividualScheduleInfoForEdit({
        edit: false,
      });
      return;
    }
    this.HospitalStateService.setHospitalScheduleFormEvent(
      !this.openFormComponent
    );
  }

  onViewDetails(item: any): void {
    this.clickView = item.id;
    this.HospitalStateService.setHospitalScheduleFormEvent(true);
    this.HospitalStateService.setIndividualScheduleInfoForEdit({
      edit: true,
      id: item.id,
    });
    this.DoctorScheduleService.get(item.id).subscribe((res) =>
      this.HospitalStateService.setIndividualScheduleInfo(res)
    );
  }
}
