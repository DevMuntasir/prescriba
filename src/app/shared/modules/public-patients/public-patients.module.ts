import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPatientsComponent } from './public-patients.component';
import { AgentAppointmentsModule } from '../agent-appointments/agent-appointments.module';
import { Route, RouterModule } from '@angular/router';
import { TableSkeletonModule } from '../table-skeleton/table-skeleton.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientCardComponent } from './patient-card/patient-card.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

const routes: Route[] = [
  {
    path: '',
    component: PublicPatientsComponent,
  },
];

@NgModule({
  declarations: [PublicPatientsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgentAppointmentsModule,
    TableSkeletonModule,
    ReactiveFormsModule,
    PatientCardComponent,
    InfiniteScrollDirective,
  ],
  exports: [PublicPatientsComponent],
})
export class PublicPatientsModule {}
