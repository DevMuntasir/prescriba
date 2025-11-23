import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { AppointmentsComponent } from './appointments.component';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionBookingDialogComponent } from './session-booking-dialog/session-booking-dialog.component';

const routes: Route[] = [
  {
    path: '',
    component: AppointmentsComponent,
  },
];

@NgModule({
  declarations: [AppointmentsComponent, SessionBookingDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class AppointmentsModule {}

