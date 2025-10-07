import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayShorterPipe } from '../../../pipe/day-shorter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-doctor-info',
  standalone: true,
  imports: [
    CommonModule,
    DayShorterPipe,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.scss',
})
export class DoctorInfoComponent {
  @Input() doctor: any;
  @Input() isPreHand = false;
  @Input() isHeader = true;
}
