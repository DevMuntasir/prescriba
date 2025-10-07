import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorBookingStateService {

  // private bookingInfo = new BehaviorSubject<any>({});
  constructor() {}
  // sendBookingData(data: any) {
  //   this.bookingInfo.next(data);
  //   localStorage.removeItem('booking-info');
  //   localStorage.setItem('booking-info', JSON.stringify(data));
  // }
  // getBookingData() {
  //   const bookingInfo = localStorage.getItem('booking-info');
  //   if (bookingInfo) {
  //     this.bookingInfo.next(JSON.parse(bookingInfo));
  //   }
  //   return this.bookingInfo.asObservable();
  // }
}
