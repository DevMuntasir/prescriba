import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrescriptionPatientService } from '../../../services/patient-service';
import { debounceTime, distinctUntilChanged, switchMap, filter, takeUntil, tap, finalize } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.scss',
})
export class PatientInfoComponent implements OnInit, OnDestroy {
  @Input() patient!: FormGroup;

  readonly genderOptions = ['Male', 'Female', 'Other'];
  patientNotFound = false;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private patientService: PrescriptionPatientService) { }

  ngOnInit(): void {
    this.setupMobileNumberListener();
  }

  private setupMobileNumberListener(): void {
    const mobileControl = this.patient.get('patientPhoneNo');
    if (!mobileControl) return;

    mobileControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          if (!value || value.length < 11) {
            this.patientNotFound = false;
          }
        }),
        filter((value) => value && value.length >= 11),
        tap(() => {
          this.isLoading = true;
          this.patientNotFound = false;
        }),
        switchMap((mobile) => {
          return this.patientService.getPrescriptionPatients({
            searchTerm: mobile,
            pageNumber: 1,
            pageSize: 1
          }).pipe(
            finalize(() => this.isLoading = false)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response.result && response.result.length > 0) {
            const foundPatient = response.result[0];
            this.patientNotFound = false;
            this.patient.patchValue({
              patientName: foundPatient.patientName || foundPatient.firstName ,
              patientAge: foundPatient.patientAge,
              patientGender: foundPatient.gender,
              patientBloodGroup: foundPatient.bloodGroup,
              // We don't overwrite phone number as it's the search key
            }, { emitEvent: false });
          } else {
            this.patientNotFound = true;
            // Optional: Clear other fields if not found? 
            // Requirement says "user writ manually", so maybe keeping what they typed or clearing is fine. 
            // Usually better to not clear if they started typing, but here we are searching.
            // Let's assume we don't clear, just show message.
          }
        },
        error: (err) => {
          console.error('Error searching patient', err);
          this.patientNotFound = false; // Or show error message
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
