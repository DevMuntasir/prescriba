import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import {
  PrescriptionPatient,
  PrescriptionPatientService,
} from '../prescribe/services/patient-service';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.component.html',
  styleUrls: ['./my-patients.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class MyPatientsComponent implements OnInit, OnDestroy {
  private readonly patientService = inject(PrescriptionPatientService);
  private readonly destroy$ = new Subject<void>();
  private patientRequestSub?: Subscription;

  searchControl = new FormControl('', { nonNullable: true });
  patients: PrescriptionPatient[] = [];
  isLoading = false;
  error?: string;

  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  hasMore = false;
  readonly pageSizeOptions = [10, 25, 50];

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.pageNumber = 1;
        this.loadPatients(term);
      });

    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.patientRequestSub?.unsubscribe();
  }

  get hasKnownTotal(): boolean {
    return this.totalCount > 0;
  }

  get totalPages(): number {
    if (this.hasKnownTotal) {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    }

    if (this.hasMore) {
      return this.pageNumber + 1;
    }

    return this.patients.length > 0 ? this.pageNumber : 0;
  }

  get pageRangeStart(): number {
    if (this.patients.length === 0) {
      return 0;
    }

    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get pageRangeEnd(): number {
    if (this.patients.length === 0) {
      return 0;
    }

    const upperBound = this.pageNumber * this.pageSize;
    return this.hasKnownTotal
      ? Math.min(upperBound, this.totalCount)
      : (this.pageNumber - 1) * this.pageSize + this.patients.length;
  }

  get displayedTotal(): number {
    if (this.hasKnownTotal) {
      return this.totalCount;
    }

    return (this.pageNumber - 1) * this.pageSize + this.patients.length;
  }

  get canGoPrevious(): boolean {
    return this.pageNumber > 1 && !this.isLoading;
  }

  get canGoNext(): boolean {
    if (this.isLoading) {
      return false;
    }

    if (this.hasKnownTotal) {
      return this.pageNumber < this.totalPages;
    }

    return this.hasMore;
  }

  goToPage(page: number): void {
    if (page < 1 || page === this.pageNumber) {
      return;
    }

    if (this.hasKnownTotal && page > this.totalPages) {
      return;
    }

    if (!this.hasKnownTotal && page > this.pageNumber + 1) {
      return;
    }

    this.pageNumber = page;
    this.loadPatients();
  }

  onPageSizeChange(size: string): void {
    const nextSize = Number(size);
    if (!nextSize || nextSize === this.pageSize) {
      return;
    }

    this.pageSize = nextSize;
    this.pageNumber = 1;
    this.loadPatients();
  }

  clearSearch(): void {
    if (!this.searchControl.value) {
      return;
    }

    this.pageNumber = 1;
    this.searchControl.setValue('');
  }

  trackByPatient(index: number, patient: PrescriptionPatient): number {
    return (
      patient.patientID || patient.userID || patient.patientReferenceID || index
    );
  }

  private loadPatients(searchTerm = this.searchControl.value): void {
    this.patientRequestSub?.unsubscribe();
    this.isLoading = true;
    this.error = undefined;

    this.patientRequestSub = this.patientService
      .getPrescriptionPatients({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerm,
      })
      .subscribe({
        next: (response) => {
          if (response.isSuccess === false) {
            this.handleError(response.message || 'Failed to load patients.');
            return;
          }

          this.patients = response.result ?? [];
          const aggregatedTotal =
            response.totalCount ?? this.patients[0]?.totalCount ?? 0;
          this.totalCount = aggregatedTotal;
          const hasKnownTotal = this.totalCount > 0;
          this.hasMore = hasKnownTotal
            ? this.pageNumber * this.pageSize < this.totalCount
            : this.patients.length === this.pageSize;
          this.isLoading = false;
        },
        error: () => {
          this.handleError('Failed to load patients. Please try again.');
        },
      });
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.patients = [];
    this.totalCount = 0;
    this.hasMore = false;
    this.error = message;
  }
}
