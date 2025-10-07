import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPatientsComponent } from './my-patients.component';
import { Route, RouterModule } from '@angular/router';
import { PublicPatientsModule } from 'src/app/shared/modules/public-patients/public-patients.module';


const routes: Route[] = [
  {
    path: '',
    component: MyPatientsComponent,
  },
  {
    path: 'patient-details/:patientProfileId', 
    loadChildren: () =>
      import('../../../shared/modules/patient-details/patient-details.module').then(
        (m) => m.PatientDetailsModule
      ),
  },
];


@NgModule({
  declarations: [
    MyPatientsComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes),PublicPatientsModule
  ]
})
export class MyPatientsModule { }
