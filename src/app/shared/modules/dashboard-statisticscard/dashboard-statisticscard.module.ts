import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatisticscardComponent } from './dashboard-statisticscard.component';



@NgModule({
  declarations: [DashboardStatisticscardComponent],
  imports: [
    CommonModule
  ],
  exports:[
    DashboardStatisticscardComponent
  ]
})
export class DashboardStatisticscardModule { }
