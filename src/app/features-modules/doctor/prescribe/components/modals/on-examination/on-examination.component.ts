import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PrescriptionService } from '../../../services/prescription.service';

@Component({
  selector: 'app-on-examination',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './on-examination.component.html',
})
export class OnExaminationComponent implements AfterViewInit {
  @Input() data: any;
  vitalsForm: FormGroup;
  PrescriptionService = inject(PrescriptionService);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OnExaminationComponent>
  ) {
    this.vitalsForm = this.fb.group({
      systolic: ['', [Validators.required, Validators.min(0)]],
      diastolic: ['', [Validators.required, Validators.min(0)]],
      pulse: ['', [Validators.required, Validators.min(0)]],
      temperature: [''],
      weight: [''],
      heightFeet: [''],
      heightInches: [''],
    });
  }

  ngAfterViewInit(): void {
    const exam = JSON.parse(JSON.stringify(this.data));
    this.vitalsForm.patchValue(exam[0]);
  }

  showBMI() {
    // Implement BMI calculation logic
  }

  showBSA() {
    // Implement BSA calculation logic
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveOnExamination(): void {
    this.PrescriptionService.addOnExam(this.vitalsForm);
    this.dialogRef.close();
  }
}
