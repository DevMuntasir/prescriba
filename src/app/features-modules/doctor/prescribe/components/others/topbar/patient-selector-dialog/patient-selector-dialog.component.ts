import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  PrescriptionPatient,
  PrescriptionPatientService,
} from '../../../../services/patient-service';

interface PatientDialogData {
  doctorId?: number;
}

export interface PatientInfoPayload {
  patientName: string;
  patientAge: string;
  patientGender: string | null;
  patientProfileId: number | null;
  patientCode: string | null;
  patientPhoneNo: string | null;
  patientBloodGroup: string | null;
}

@Component({
  selector: 'app-patient-selector-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-selector-dialog.component.html',
  styleUrl: './patient-selector-dialog.component.scss',
})
export class PatientSelectorDialogComponent {
  readonly searchForm: FormGroup = this.fb.group({
    mobileNo: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly manualForm: FormGroup = this.fb.group({
    patientName: ['', Validators.required],
    patientAge: ['', Validators.required],
    patientGender: ['', Validators.required],
    patientBloodGroup: [''],
    patientPhoneNo: ['', Validators.required],
  });

  patients: PrescriptionPatient[] = [];
  isSearching = false;
  searchAttempted = false;
  showManualEntry = false;
  manualSubmitted = false;
  errorMessage = '';

  constructor(
    private readonly dialogRef: MatDialogRef<PatientSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: PatientDialogData,
    private readonly fb: FormBuilder,
    private readonly patientService: PrescriptionPatientService
  ) {}

  get mobileNoControl() {
    return this.searchForm.get('mobileNo');
  }

  get manualControls() {
    return this.manualForm.controls;
  }

  searchPatient(): void {
    this.searchAttempted = true;
    this.errorMessage = '';

    if (this.searchForm.invalid) {
      return;
    }

    const term = String(this.mobileNoControl?.value || '').trim();
    if (!term) {
      return;
    }

    this.isSearching = true;
    this.patientService
      .getPrescriptionPatients({
        pageNumber: 1,
        pageSize: 5,
        searchTerm: term,
      })
      .subscribe({
        next: (response) => {
          this.isSearching = false;
          this.patients = response.result?.filter((patient) =>
            (patient.phoneNumber || '')
              .toLowerCase()
              .includes(term.toLowerCase())
          ) || [];

          if (this.patients.length === 0) {
            this.showManualEntry = true;
            this.manualForm.patchValue({ patientPhoneNo: term });
            this.errorMessage = 'No patient matched that mobile number. Please add details manually.';
          }
        },
        error: () => {
          this.isSearching = false;
          this.showManualEntry = true;
          this.manualForm.patchValue({ patientPhoneNo: term });
          this.errorMessage = 'Unable to search patients right now. Please add the patient details manually.';
        },
      });
  }

  usePatient(patient: PrescriptionPatient): void {
    const payload = this.mapPatientInfo(patient);
    this.dialogRef.close(payload);
  }

  submitManual(): void {
    this.manualSubmitted = true;
    this.errorMessage = '';

    if (this.manualForm.invalid) {
      return;
    }

    const payload: PatientInfoPayload = {
      patientName: this.manualControls['patientName'].value,
      patientAge: String(this.manualControls['patientAge'].value || ''),
      patientGender: this.manualControls['patientGender'].value,
      patientProfileId: null,
      patientCode: null,
      patientPhoneNo: this.manualControls['patientPhoneNo'].value,
      patientBloodGroup: this.manualControls['patientBloodGroup'].value,
    };

    this.dialogRef.close(payload);
  }

  close(): void {
    this.dialogRef.close();
  }

  private mapPatientInfo(patient: PrescriptionPatient): PatientInfoPayload {
    const name = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    return {
      patientName: name || 'Unknown Patient',
      patientAge: patient.patientAge || '',
      patientGender: patient.gender || null,
      patientProfileId: patient.patientID || patient.patientReferenceID || null,
      patientCode: patient.patientReferenceID
        ? String(patient.patientReferenceID)
        : null,
      patientPhoneNo: patient.phoneNumber || null,
      patientBloodGroup: patient.bloodGroup || null,
    };
  }
}
