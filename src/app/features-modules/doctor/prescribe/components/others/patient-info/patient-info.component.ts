import { PrescriptionService } from './../../../services/prescription.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.scss',
})
export class PatientInfoComponent {
  form!: FormGroup;
  @Input() patient!: FormGroup;
  constructor() {}
}
