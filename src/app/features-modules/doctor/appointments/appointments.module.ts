import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AppointmentsComponent } from './appointments.component';
import { Route, RouterModule } from '@angular/router';
import { AllAppointmentsModule } from 'src/app/shared/modules/all-appointments/all-appointments.module';

const routes: Route[] = [
  {
    path: '',
    component: AppointmentsComponent,
  },
];

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AllAppointmentsModule,
    NgOptimizedImage,
  ],
})
export class AppointmentsModule {}
