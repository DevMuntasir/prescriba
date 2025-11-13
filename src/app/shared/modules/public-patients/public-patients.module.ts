import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPatientsComponent } from './public-patients.component';
import { Route, RouterModule } from '@angular/router';
import { TableSkeletonModule } from '../table-skeleton/table-skeleton.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientCardComponent } from './patient-card/patient-card.component';

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
    TableSkeletonModule,
    ReactiveFormsModule,
    PatientCardComponent,
  ],
  exports: [PublicPatientsComponent],
})
export class PublicPatientsModule {}
