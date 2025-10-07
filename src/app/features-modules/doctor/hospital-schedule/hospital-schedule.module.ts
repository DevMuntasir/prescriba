import { HospitalInfoComponent } from './hospital-info/hospital-info.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialModulesModule } from 'src/app/shared/modules/material-modules/material-modules.module';
import { HospitalScheduleComponent } from './hospital-schedule.component';
import { HospitalDialogComponent } from './hospital-dialog/hospital-dialog.component';
import { ScheduleInfoComponent } from './schedule-info/schedule-info.component';
import { SectionHeaderComponent } from 'src/app/shared/components/section-header/section-header.component';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import { DialogHeaderComponent } from 'src/app/shared/components/dialog-header/dialog-header.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { FeeSetupComponent } from './fee-info/fee-setup.component';
import { FeeDialogComponent } from './fee-dialog/fee-dialog.component';
import { ConfirmDialogModule } from 'src/app/shared/modules/confirm-dialog/confirm-dialog.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

const routes: Route[] = [
  {
    path: '',
    component: HospitalScheduleComponent,
  },
];
@NgModule({
  declarations: [
    HospitalInfoComponent,
    HospitalScheduleComponent,
    HospitalDialogComponent,
    ScheduleInfoComponent,
    SectionHeaderComponent,
    ScheduleDialogComponent,
    DialogHeaderComponent,
    ScheduleFormComponent,
    FeeSetupComponent,
    FeeDialogComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModulesModule,
    InputModule,
    ConfirmDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    NgxMatTimepickerModule,
  ],
  providers: [DatePipe],
})
export class HospitalScheduleModule {}
