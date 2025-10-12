import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { TopMedicinesComponent } from './top-medicines/top-medicines.component';

const routes: Route[] = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
  {
    path: 'top-medicines',
    component: TopMedicinesComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminDashboardComponent,
    TopMedicinesComponent,
  ],
})
export class AdminDashboardModule {}
