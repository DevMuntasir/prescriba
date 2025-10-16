import {
  DoctorProfileService} from 'src/app/proxy/services';

import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserinfoStateService implements OnInit {
  constructor(
    private DoctorProfileService: DoctorProfileService,
    private NormalAuth: AuthService,
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
      if (role == 'doctor') {
        this.DoctorProfileService.get(id).subscribe((res) => {
          this.sendData(res);
        });
      }
    }
  }


}
