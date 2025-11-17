import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DoctorProfileService } from 'src/app/api/services';

@Injectable({
  providedIn: 'root',
})
export class DoctorStateService {
  public doctorsList = new BehaviorSubject<any>([]);
  public currentlyOnlineDoctor = new BehaviorSubject<any>([]);

  instantDoctorsWithImage = signal<any[]>([]);

  constructor(private DoctorProfileService: DoctorProfileService) {}
  getDoctorListData() {
    return this.doctorsList.asObservable();
  }
  getCurrentlyOnlineDoctorData() {
    return this.currentlyOnlineDoctor.asObservable();
  }
  sendDoctorListData(data: any[]) {
    this.doctorsList.next(data);
  }
  sendCurrentlyOnlineDoctorData(data: any[]) {
    this.currentlyOnlineDoctor.next(data);
  }
  //all doctors
  getAllDoctorList() {
    this.DoctorProfileService.getList().subscribe((e) => {
      this.sendDoctorListData(e);
    });
    return this.getDoctorListData();
  }

  //all current online doctors
  getCurrentlyOnlineDoctorList() {
    this.DoctorProfileService.getCurrentlyOnlineDoctorList().subscribe((e) => {
      this.sendCurrentlyOnlineDoctorData(e);
    });
    return this.getCurrentlyOnlineDoctorData();
  }

  getLiveOnlineDoctorList(data: any) {
    this.DoctorProfileService.getLiveOnlineDoctorList(data).subscribe((e) => {
      this.sendCurrentlyOnlineDoctorData(e);
    });
    return this.getCurrentlyOnlineDoctorData();
  }

  setInstantDoctorsWithImage(data: any[]) {
    this.instantDoctorsWithImage.set(data);
  }
}
