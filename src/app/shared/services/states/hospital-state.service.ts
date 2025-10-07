import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalStateService {

  private sharedDataSubject = new Subject<any>();
  private individualScheduleInfo = new Subject<any>();
  private individualScheduleInfoForEdit = new Subject<any>();
  private hospitalScheduleFormEvent = new BehaviorSubject<any>(false);
   private doctorScheduleList =new BehaviorSubject<any>([]);
  sendData(data: any) {
    this.sharedDataSubject.next(data);
  }
  getData() {
    return this.sharedDataSubject.asObservable();
  }
  setHospitalScheduleFormEvent(data:boolean){
    this.hospitalScheduleFormEvent.next(data);
  }
  getHospitalScheduleFormEvent(){
    return this.hospitalScheduleFormEvent.asObservable();
  }
  setIndividualScheduleInfo(data:{}){
    this.individualScheduleInfo.next(data);
  }
  getIndividualScheduleInfo(){
    return this.individualScheduleInfo.asObservable();
  }

  getIndividualScheduleInfoForEdit(){
    return this.individualScheduleInfoForEdit.asObservable();
  }
  setIndividualScheduleInfoForEdit(data:{}){
    this.individualScheduleInfoForEdit.next(data);
  }


  getDoctorScheduleList(){
    return this.doctorScheduleList.asObservable();
    
  }
  setDoctorScheduleList(data:any){
    this.doctorScheduleList.next(data);
  }

}
