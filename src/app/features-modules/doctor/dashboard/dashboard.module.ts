import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { DashboardStatisticscardModule } from 'src/app/shared/modules/dashboard-statisticscard/dashboard-statisticscard.module';
import { FormsModule } from '@angular/forms';
import { TableSkeletonModule } from 'src/app/shared/modules/table-skeleton/table-skeleton.module';
import { WelcomeHeaderComponent } from './welcome-header/welcome-header.component';
import { StatsComponent } from './stats/stats.component';
import { WarrningComponent } from './warrning/warrning.component';
import { MatTabsModule } from '@angular/material/tabs';
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
    DashboardStatisticscardModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TableSkeletonModule,
    WelcomeHeaderComponent,
    StatsComponent,
    WarrningComponent,
    MatTabsModule,
    ProfileOnboardingModalComponent,
  ],
})
export class DashboardModule {}
