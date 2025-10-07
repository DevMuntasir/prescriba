import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorScheduleStateService {
  private doctorSlotList = new BehaviorSubject<any>([]);
  private doctorScheduleList = new BehaviorSubject<any>([]);
  private selectedSlot = new Subject();

  constructor() {}
  // doctor available slots after filter
  sendDoctorAvailableSlotData(data: any) {
    this.doctorSlotList.next(data);
  }
  getDoctorAvailableSlotData() {
    return this.doctorSlotList.asObservable();
  }

  // doctor schedule info

  sendDoctorScheduleData(data: any) {
    this.doctorScheduleList.next(data);
  }
  getDoctorScheduleData() {
    return this.doctorScheduleList.asObservable();
  }

  sendSelectedSlot(data: {}) {
    this.selectedSlot.next(data);
  }
  getSelectedSlot() {
    return this.selectedSlot.asObservable();
  }
}
