import { PromoCodeService } from 'src/app/proxy/services';
import { TosterService } from '../../../services/toster.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  constructor(
    private TosterService: TosterService,
    private PromoCodeService: PromoCodeService
  ) {}

  applyCouponToDiscount(
    code: string,
    bookingInfo: any,
    onSuccess: (updatedBookingInfo: any, discountInfo: any) => void
  ): void {
    console.log(code, bookingInfo);

    if (!bookingInfo) {
      this.TosterService.customToast('Booking information is invalid', 'error');
      return;
    }
    let discountInfo = {};
    this.PromoCodeService.getByName(code).subscribe({
      next: (res) => {
        discountInfo = res;
        if (!res.discountAmount || !res.discountAmountIn) {
          this.TosterService.customToast('Invalid coupon data', 'error');
          return;
        }

        let updatedBookingInfo = { ...bookingInfo };

        switch (res.discountAmountIn) {
          case 1: // Fixed discount
            if (bookingInfo.totalAppointmentFee < res.discountAmount) {
              this.TosterService.customToast(
                'Discount amount exceeds the total appointment fee!',
                'error'
              );
              return;
            }

            updatedBookingInfo.totalAppointmentFee =
              bookingInfo.totalAppointmentFee - res.discountAmount;

            this.TosterService.customToast(
              `Coupon applied! Discount: ${res.discountAmount}`,
              'success'
            );
            break;

          case 2: // Percentage discount
            const percentageDiscount =
              (bookingInfo.totalAppointmentFee * res.discountAmount) / 100;

            if (bookingInfo.totalAppointmentFee < percentageDiscount) {
              this.TosterService.customToast(
                'Discount exceeds the total appointment fee!',
                'error'
              );
              return;
            }

            updatedBookingInfo.totalAppointmentFee =
              bookingInfo.totalAppointmentFee - percentageDiscount;

            this.TosterService.customToast(
              `Coupon applied! Discount: ${res.discountAmount}%`,
              'success'
            );
            break;

          default:
            this.TosterService.customToast('Invalid discount type', 'error');
            return;
        }

        // Ensure totalAppointmentFee doesn't drop below 0
        if (updatedBookingInfo.totalAppointmentFee < 0) {
          updatedBookingInfo.totalAppointmentFee = 0;
        }

        // Call the success callback
        onSuccess(updatedBookingInfo, discountInfo);
      },
      error: (err) => {
        console.log('Error applying coupon:', err);
        this.TosterService.customToast(
          'Failed to apply coupon. Please try again.',
          'error'
        );
      },
    });
  }
}
