import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardOverviewComponent } from './overview/overview.component';
import { AdminPrescriptionsComponent } from './prescriptions/admin-prescriptions.component';
import { AdminDoctorsComponent } from './doctors/admin-doctors.component';

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
  ],
})
export class AdminDashboardModule {}
