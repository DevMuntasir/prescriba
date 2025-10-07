// import { TosterService } from './../../../shared/services/toster.service';
import { Component, OnInit } from '@angular/core';
import { HospitalStateService } from 'src/app/shared/services/states/hospital-state.service';

@Component({
  selector: 'app-hospital-schedule',
  templateUrl: './hospital-schedule.component.html',
  styleUrls: ['./hospital-schedule.component.scss'],
})
export class HospitalScheduleComponent implements OnInit {
  activeTab: any;
  scheduleCompleted = false;
  constructor(
    private HospitalStateService: HospitalStateService
  ) // private TosterService: TosterService
  {}
  ngOnInit(): void {
    this.HospitalStateService.getDoctorScheduleList().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.scheduleCompleted = true;
        } else {
          // this.TosterService.customToast("Please add your schedule first!", 'warning')
          this.scheduleCompleted = false;
        }
      },
    });
  }
}
