import { CouponService } from '../../components/coupon-card/service/coupon.service';
import { PromoCodeService } from './../../../proxy/services/promo-code.service';
import { AuthService } from './../../services/auth.service';
import {
  AppointmentService,
  EkPayService,
  SslCommerzService,
} from 'src/app/proxy/services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EkPayInputDto,
  PromoCodeInputDto,
  SslCommerzInputDto,
} from 'src/app/proxy/input-dto';
import { TosterService } from 'src/app/shared/services/toster.service';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  AppointmentType,
  PromoType,
  promoTypeOptions,
} from 'src/app/proxy/enums';
import { ListItem } from 'src/app/shared/model/common-model';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DynamicBookingComponent } from '../dynamic-booking/dynamic-booking.component';
import { AppointmentInputDto } from 'src/app/proxy/dto-models';
//import { BookingDialogComponent } from '../../components/booking-dialog/booking-dialog.component';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.scss'],
})
export class BookingReviewComponent implements OnInit {
  @Input() bookingInfo: any;
  @Output() gotToBack = new EventEmitter<any>();
  //SSLCommerz
  sslInputDto = {
    applicantCode: '',
    examFee: 100,
    serviceCharge: 0,
    customAmount: 10,
    isCustomAmount: false,
  };
  hasValidCode = false;

  sslCInputDto: SslCommerzInputDto = {} as SslCommerzInputDto;
  loading: boolean = false;
  appointmentType: ListItem[];
  userType!: string;
  couponDiscountType!: ListItem[];
  discount!: PromoCodeInputDto;

  constructor(
    private ToasterService: TosterService,
    private AppointmentService: AppointmentService,
    private PromoCodeService: PromoCodeService,
    private AuthService: AuthService,
    private sslCommerzService: SslCommerzService, //private sslCommerzService: PaymentService
    private ekPayService: EkPayService, //private sslCommerzService: PaymentService
    private _router: Router,
    public dialogRef: MatDialogRef<DynamicBookingComponent>,
    private CouponService: CouponService
  ) {
    this.appointmentType = CommonService.getEnumList(AppointmentType);
  }
  ngOnInit(): void {
    this.userType = this.AuthService.authInfo().userType;
  }
  getTitle(id: any, type: string) {
    if (type == 'appointmentType') {
      return this.appointmentType.find((res) => res.id == id);
    } else {
      return;
    }
  }
  //getChamber(id: any) {
  //  this.DoctorChamberService.get(id).subscribe(c => {
  //    return c.chamberName?c.chamberName:'N/A';
  //  });

  //}

  createAppointmentAndPayment() {
    this.loading = true;
    const booking = {
      ...this.bookingInfo,
      appointmentStatus: this.bookingInfo.totalAppointmentFee === 0 ? 2 : 1,
    };

    try {
      this.AppointmentService.create(booking).subscribe({
        next: (res) => {
          if (res.totalAppointmentFee) {
            // if (this.userType == 'agent') {
            //   this.payWithEkpay(res.appointmentCode),
            //     localStorage.setItem(
            //       'patientAppointmentCode',
            //       JSON.stringify(res.appointmentCode)
            //     );
            // } else {
            //   this.payWithSslCommerz(res.appointmentCode),
            //     localStorage.setItem(
            //       'patientAppointmentCode',
            //       JSON.stringify(res.appointmentCode)
            //     );
            // }
            // this.payWithEkpay(res.appointmentCode),
            //   localStorage.setItem(
            //     'patientAppointmentCode',
            //     JSON.stringify(res.appointmentCode)
            //   );
            this.payWithSslCommerz(res.appointmentCode),
              localStorage.setItem(
                'patientAppointmentCode',
                JSON.stringify(res.appointmentCode)
              );
          } else {
            localStorage.setItem(
              'patientAppointmentCode',
              JSON.stringify(res.appointmentCode)
            );
            this._router.navigate(['/payment-success']);
            this.dialogRef.close();
          }
        },
        error: (err) => {
          console.log(err);
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          ),
            (this.loading = false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  payWithSslCommerz(appointmentCode: any): void {
    if (this.bookingInfo) {
      const sslCommerzInputDto: SslCommerzInputDto = {} as SslCommerzInputDto;
      sslCommerzInputDto.applicationCode = appointmentCode;
      // console.log(this.bookingInfo.totalAppointmentFee);

      sslCommerzInputDto.totalAmount = String(
        this.bookingInfo.totalAppointmentFee
      );
      sslCommerzInputDto.transactionId = '';
      this.sslCommerzService.initiatePayment(sslCommerzInputDto).subscribe({
        next: (response) => {
          console.log(response);

          if (
            response &&
            response.status === 'SUCCESS' &&
            response.gatewayPageURL
          ) {
            window.location.href = response.gatewayPageURL;
            this.loading = false;
          } else {
            this.loading = false;
            this.ToasterService.customToast(
              String(response.failedreason),
              'error'
            );
          }
        },
        error: (err) => {
          this.loading = false;
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          );
        },
      });
    } else {
      this.loading = false;
      this.ToasterService.customToast('Booking info not found', 'error');
    }
  }

  payWithEkpay(appointmentCode: any): void {
    if (this.bookingInfo) {
      const ekpayInputDto: EkPayInputDto = {} as EkPayInputDto;
      ekpayInputDto.applicationCode = appointmentCode;
      ekpayInputDto.totalAmount = String(this.bookingInfo.totalAppointmentFee);
      ekpayInputDto.transactionId = '';

      this.ekPayService.initiatePayment(ekpayInputDto).subscribe({
        next: (response) => {
          console.log(this.bookingInfo.totalAppointmentFee);
          if (
            response &&
            response.status === '1000' &&
            response.gatewayPageURL
          ) {
            window.location.href = response.gatewayPageURL;
            this.loading = false;
          } else {
            this.loading = false;
            this.ToasterService.customToast(String(response.message), 'error');
          }
        },
        error: (err) => {
          this.loading = false;
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          );
        },
      });
    } else {
      this.loading = false;
      this.ToasterService.customToast('Booking info not found', 'error');
    }
  }

  getDayOfWeek(date: Date) {
    date = new Date(date);
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[date.getDay()];
  }
  // applyCoupon(code: string): void {
  //   console.log(`Applying coupon: ${code}`);

  //   // Ensure bookingInfo exists
  //   if (!this.bookingInfo) {
  //     this.ToasterService.customToast(
  //       'Booking information is invalid',
  //       'error'
  //     );
  //     return;
  //   }

  //   // Ensure totalAppointmentFee exists
  //   // if (!this.bookingInfo.totalAppointmentFee) {
  //   //   this.ToasterService.customToast('Not applicable!', 'error');
  //   //   return;
  //   // }

  //   this.PromoCodeService.getByName(code).subscribe({
  //     next: (res) => {
  //       if (!res.discountAmount || !res.discountAmountIn) {
  //         this.ToasterService.customToast('Invalid coupon data', 'error');
  //         return;
  //       }

  //       this.discount = res;

  //       switch (res.discountAmountIn) {
  //         case 1: // Fixed discount
  //           if (this.bookingInfo.totalAppointmentFee < res.discountAmount) {
  //             this.ToasterService.customToast(
  //               'Discount amount exceeds the total appointment fee!',
  //               'error'
  //             );
  //             return;
  //           }

  //           this.bookingInfo = {
  //             ...this.bookingInfo,
  //             totalAppointmentFee:
  //               this.bookingInfo.totalAppointmentFee - res.discountAmount,
  //           };
  //           this.hasValidCode = true;
  //           this.ToasterService.customToast(
  //             `Coupon applied! Discount: ${res.discountAmount}`,
  //             'success'
  //           );
  //           break;

  //         case 2: // Percentage discount
  //           const percentageDiscount =
  //             (this.bookingInfo.totalAppointmentFee * res.discountAmount) / 100;

  //           if (this.bookingInfo.totalAppointmentFee < percentageDiscount) {
  //             this.ToasterService.customToast(
  //               'Discount exceeds the total appointment fee!',
  //               'error'
  //             );
  //             return;
  //           }

  //           this.bookingInfo = {
  //             ...this.bookingInfo,
  //             totalAppointmentFee:
  //               this.bookingInfo.totalAppointmentFee - percentageDiscount,
  //           };
  //           this.hasValidCode = true;
  //           this.ToasterService.customToast(
  //             `Coupon applied! Discount: ${res.discountAmount}%`,
  //             'success'
  //           );
  //           break;

  //         default:
  //           this.ToasterService.customToast('Invalid discount type', 'error');
  //           break;
  //       }

  //       // Ensure totalAppointmentFee doesn't drop below 0
  //       if (this.bookingInfo.totalAppointmentFee < 0) {
  //         this.bookingInfo.totalAppointmentFee = 0;
  //       }

  //       console.log('Updated Booking Info:', this.bookingInfo);
  //     },
  //     error: (err) => {
  //       console.log('Error applying coupon:', err);
  //       this.ToasterService.customToast(
  //         'Failed to apply coupon. Please try again.',
  //         'error'
  //       );
  //     },
  //   });
  // }
}
