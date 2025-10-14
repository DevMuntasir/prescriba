import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardOverviewComponent } from './overview/overview.component';
import { AdminPrescriptionsComponent } from './prescriptions/admin-prescriptions.component';
import { AdminDoctorsComponent } from './doctors/admin-doctors.component';
import { TopMedicinesComponent } from './overview/top-medicine/top-medicine.component';

const routes: Route[] = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        component: AdminDashboardOverviewComponent,
      },
      {
        path: 'prescriptions',
        component: AdminPrescriptionsComponent,
      },
      {
        path: 'doctors',
        component: AdminDoctorsComponent,
      },
      {
        path: 'top-medicines',
        component: TopMedicinesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminDashboardComponent,
    AdminDashboardOverviewComponent,
    AdminPrescriptionsComponent,
    AdminDoctorsComponent,
    TopMedicinesComponent,
  ],
})
export class AdminDashboardModule {}
