import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionsComponent } from './prescriptions.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PrescriptionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([])
  ],
  exports:[
    PrescriptionsComponent
  ]
})
export class PrescriptionsModule { }
