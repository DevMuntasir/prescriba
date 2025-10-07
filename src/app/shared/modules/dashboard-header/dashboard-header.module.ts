import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicDialogModule } from '../dynamic-dialog/dynamic-dialog.module';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [
    CommonModule,
    NgOptimizedImage,
    DynamicDialogModule,
    RouterModule.forChild([]),
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}
