import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes: Route[] = [
  {
    path: '',
    component: SignupComponent,
  },
];
@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOtpInputModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    NgOptimizedImage,
  ],

  providers: [DatePipe],
})
export class SignupModule {}
