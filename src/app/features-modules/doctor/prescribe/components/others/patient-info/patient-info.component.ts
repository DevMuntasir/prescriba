import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.scss',
})
export class PatientInfoComponent {
  @Input() patient!: FormGroup;

  readonly genderOptions = ['Male', 'Female', 'Other'];
}
