import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePatientComponent } from './create-patient.component';
import { InputModule } from '../input/input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreatePatientComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    CreatePatientComponent
  ]
})
export class CreatePatientModule { }
