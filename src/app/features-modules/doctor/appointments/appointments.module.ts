import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AppointmentsComponent } from './appointments.component';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
})
export class AppointmentsModule {}
