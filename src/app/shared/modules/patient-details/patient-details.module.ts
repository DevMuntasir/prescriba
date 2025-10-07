import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDetailsComponent } from './patient-details.component';
import { Route, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';
import { PatientDoctorsComponent } from './patient-doctors/patient-doctors.component';
import { PatientMedicalRecordsComponent } from './patient-medical-records/patient-medical-records.component';
import { PatientBillingHistoryComponent } from './patient-billing-history/patient-billing-history.component';
import { PatientPrescriptionsComponent } from './patient-prescriptions/patient-prescriptions.component';
import { PatientNewPrescriptionComponent } from './patient-new-prescription/patient-new-prescription.component';

const routes: Route[] = [
  {
    path: '',
    component: PatientDetailsComponent,
  },
];

@NgModule({
  declarations: [
    PatientDetailsComponent,
    PatientAppointmentsComponent,
    PatientDoctorsComponent,
    PatientMedicalRecordsComponent,
    PatientNewPrescriptionComponent,
    PatientBillingHistoryComponent,
    PatientPrescriptionsComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), MatTabsModule],
})
export class PatientDetailsModule {}
