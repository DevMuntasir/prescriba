import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';



const MatModules:any = [
  MatStepperModule,
  FormsModule,
  ReactiveFormsModule,
  MatNativeDateModule,
  MatDatepickerModule
]


@NgModule({
  imports: [MatModules],
  exports:[MatModules]
})
export class MaterialModulesModule { }
