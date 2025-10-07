import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AllAppointmentsComponent } from './all-appointments.component';
import { RouterModule } from '@angular/router';
import { AppointmentCardComponent } from '../../components/appointment-card/appointment-card.component';
import { SkeletonModule } from '../skeleton/skeleton.module';
import { ShowPrescriptionModalModule } from '../show-prescription-modal/show-prescription-modal.module';
import { AppointmentDialogComponent } from '../../components/appointment-dialog/appointment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FilterModule } from '../filter/filter.module';
import { UploadAppointmentDocDialogComponent } from '../../components/upload-appointment-doc-dialog/upload-appointment-doc-dialog.component';
import { DemoAgentDialogComponent } from 'src/app/features-modules/agent/doctors/demo-agent-specific/demo-agent-dialog/demo-agent-dialog.component';
import { AppointmentCard } from './appointment-card/appointment-card.component';
import { AppointmentFilterComponent } from './appointment-filter/appointment-filter.component';
import { AppointmentHeaderComponent } from './appointment-header/appointment-header.component';
import { AppointmentStatsComponent } from './appointment-stats/appointment-stats.component';
import { WideSkeltonComponent } from '../skeleton/wide-skelton/wide-skelton.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AllAppointmentListComponent } from './appointment-list/all-appointment-list.component';

@NgModule({
  declarations: [
    AllAppointmentsComponent,
    AppointmentCardComponent,
    AppointmentDialogComponent,
    UploadAppointmentDocDialogComponent,
    DemoAgentDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    SkeletonModule,
    ShowPrescriptionModalModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FilterModule,
    NgOptimizedImage,
    AppointmentCard,
    AppointmentFilterComponent,
    AppointmentHeaderComponent,
    AppointmentStatsComponent,
    WideSkeltonComponent,
    InfiniteScrollDirective,
    AllAppointmentListComponent,
  ],
  exports: [AllAppointmentsComponent],
})
export class AllAppointmentsModule {}
