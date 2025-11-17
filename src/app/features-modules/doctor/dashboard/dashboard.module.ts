import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableSkeletonModule } from 'src/app/shared/modules/table-skeleton/table-skeleton.module';
import { WelcomeHeaderComponent } from './welcome-header/welcome-header.component';
import { ProfileOnboardingModalComponent } from './profile-onboarding-modal/profile-onboarding-modal.component';

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TableSkeletonModule,
    WelcomeHeaderComponent,
    ProfileOnboardingModalComponent,
  ],
})
export class DashboardModule {}
