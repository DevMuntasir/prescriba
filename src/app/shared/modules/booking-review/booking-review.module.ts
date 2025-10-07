import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingReviewComponent } from './booking-review.component';
import { CouponCardComponent } from '../../components/coupon-card/coupon-card.component';

@NgModule({
  declarations: [BookingReviewComponent],
  imports: [CommonModule, CouponCardComponent],
  exports: [BookingReviewComponent],
})
export class BookingReviewModule {}
