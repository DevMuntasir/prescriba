import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Route[] = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdminDashboardComponent],
})
export class AdminDashboardModule {}
