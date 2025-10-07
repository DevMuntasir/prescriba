import { AppointmentService } from './../../../proxy/services/appointment.service';
import {
  AgentProfileService,
  DoctorProfileService,
  PatientProfileService,
} from 'src/app/proxy/services';

import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserinfoStateService implements OnInit {
  constructor(
    private DoctorProfileService: DoctorProfileService,
    private AgentProfileService: AgentProfileService,
    private PatientProfileService: PatientProfileService,
    private NormalAuth: AuthService,
    private AppointmentService: AppointmentService
  ) {}
  public authenticateUserInfo = new BehaviorSubject<any>({});
  public userPatientInfo = new BehaviorSubject<any>([]);

  sendData(data: any) {
    this.authenticateUserInfo.next(data);
  }
  getData() {
    return this.authenticateUserInfo.asObservable();
  }
  sendUserPatientData(data: any) {
    this.userPatientInfo.next(data);
  }
  getUserPatientData() {
    return this.userPatientInfo.asObservable();
  }
  ngOnInit() {
    let user = this.NormalAuth.authInfo();
    if (user.id) {
      this.getProfileInfo(user.id, user.userType);
    }
  }

  getProfileInfo(id: any, role: string): void {
    if (id) {
      // this.LoaderService.sendLoaderState(true);
      if (role == 'doctor') {
        this.DoctorProfileService.get(id).subscribe((res) => {
          this.sendData(res);
          // this.LoaderService.sendLoaderState(false);
        });
      }
      if (role == 'agent') {
        this.AgentProfileService.get(id).subscribe((res) => {
          this.sendData(res);
          // this.LoaderService.sendLoaderState(false);
        });
      }
      if (role == 'patient') {
        this.PatientProfileService.get(id).subscribe((res) => {
          this.sendData(res);

          // this.LoaderService.sendLoaderState(false);
        });
      }
    }
  }

  // get user created patient list
  getUserPatientInfo(id: any, role: string): void {
    if (id && role) {
      this.PatientProfileService.getPatientListByUserProfileId(
        id,
        role
      ).subscribe((res) => {
        this.sendUserPatientData(res);
      });
    }
    // if (id && role === 'doctor') {
    //   this.AppointmentService.getPatientListByDoctorId(id).subscribe({
    //     next: (res) => {
    //       console.log(res);

    //       this.sendUserPatientData(res);
    //     },
    //   });
    // }
    else {
      this.sendUserPatientData(null);
    }
  }
}
