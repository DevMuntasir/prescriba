import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppointmentInputDto } from 'src/app/proxy/dto-models';
import { PromoCodeInputDto } from 'src/app/proxy/input-dto';
import { CouponService } from './service/coupon.service';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  imports: [],
  templateUrl: './coupon-card.component.html',
  styleUrl: './coupon-card.component.scss',
})
export class CouponCardComponent implements OnChanges {
  previousTotalFee: number = 0;
  disableApplyButton: boolean = false;
  @Input() bookingInfo: AppointmentInputDto = {} as AppointmentInputDto;
  discount!: PromoCodeInputDto;
  constructor(private CouponService: CouponService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingInfo'] && changes['bookingInfo'].currentValue) {
      this.previousTotalFee =
        changes['bookingInfo'].currentValue.totalAppointmentFee;
    }
  }
  applyCoupon(coupon: string) {
    this.CouponService.applyCouponToDiscount(
      coupon,
      this.bookingInfo,
      (updatedBookingInfo: any, discountInfo: PromoCodeInputDto) => {
        this.bookingInfo = updatedBookingInfo;
        this.discount = discountInfo;
        this.disableApplyButton = true;
        console.log('Updated Booking Info:', this.bookingInfo);
      }
    );
  }
}
