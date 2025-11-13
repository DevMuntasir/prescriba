import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardHeaderComponent } from './dashboard-header.component';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule.forChild([]),
    MatMenuModule,
 
  ],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}
