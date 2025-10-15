import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  AdminPrescriptionService,
  MedicationDivisionUsage,
  MedicationUsage,
} from '../../../services/admin.prescription.service';

interface TopMedicineRow {
  readonly rank: number;
  readonly medicationId: number;
  readonly name: string;
  readonly genericName: string;
  readonly manufacturer: string;
  readonly usageCount: number;
  readonly share: string;
}

@Component({
  selector: 'app-top-medicines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-medicine.component.html',
  styleUrls: ['./top-medicine.component.scss'],
})
export class TopMedicinesComponent implements OnInit {
  private readonly adminPrescriptionService = inject(AdminPrescriptionService);

  loading = false;
  error: string | null = null;
  pageNumber = 1;
  pageSize = 20;
  totalCount = 0;

  modalOpen = false;
  divisionLoading = false;
  divisionError: string | null = null;
  divisionMetrics: MedicationDivisionUsage[] = [];
  selectedMedicine: TopMedicineRow | null = null;

  private pageItems: MedicationUsage[] = [];
  private readonly divisionCache = new Map<number, MedicationDivisionUsage[]>();

  ngOnInit(): void {
    this.fetchTopMedicines();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalOpen) {
      this.closeModal();
    }
  }

  get rows(): TopMedicineRow[] {
    if (!this.pageItems.length) {
      return [];
    }

    const totalUsage = this.computeTotalUsage(this.pageItems);

    return this.pageItems.map((item, index) => {
      const shareValue =
        totalUsage > 0 ? (item.usageCount / totalUsage) * 100 : 0;
      const normalizedShare = Number.isFinite(shareValue) ? shareValue : 0;
      const formattedShare =
        normalizedShare === 0 ? '0%' : `${normalizedShare.toFixed(1)}%`;

      return {
        rank: (this.pageNumber - 1) * this.pageSize + index + 1,
        medicationId: item.medicationId,
        name: item.medicationName,
        genericName: item.genericName?.trim() || 'Not specified',
        manufacturer: item.manufacturer?.trim() || 'Not specified',
        usageCount: item.usageCount,
        share: formattedShare,
      };
    });
  }

  get hasNextPage(): boolean {
    return this.pageNumber * this.pageSize < this.totalCount;
  }

  get hasPreviousPage(): boolean {
    return this.pageNumber > 1;
  }

  get totalPages(): number {
    const pages =
      this.totalCount > 0 ? Math.ceil(this.totalCount / this.pageSize) : 1;
    return pages < 1 ? 1 : pages;
  }

  onNextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.pageNumber += 1;
    this.fetchTopMedicines();
  }

  onPreviousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }
    this.pageNumber -= 1;
    this.fetchTopMedicines();
  }

  onRefresh(): void {
    this.fetchTopMedicines();
  }

  openDetails(row: TopMedicineRow): void {
    this.selectedMedicine = row;
    this.modalOpen = true;
    this.divisionError = null;
    this.divisionMetrics = [];

    const cached = this.divisionCache.get(row.medicationId);
    if (cached) {
      this.divisionMetrics = cached;
      return;
    }

    this.divisionLoading = true;
    this.adminPrescriptionService
      .getMedicationDivisionUsage(row.medicationId)
      .pipe(finalize(() => (this.divisionLoading = false)))
      .subscribe({
        next: (response) => {
          const metrics =
            response?.result ??
            response?.results ??
            ([] as MedicationDivisionUsage[]);

          this.divisionMetrics = metrics;
          if (metrics.length) {
            this.divisionCache.set(row.medicationId, metrics);
          } else {
            this.divisionError =
              response?.message ??
              'No regional distribution data available right now.';
          }
        },
        error: () => {
          this.divisionError =
            'Unable to load regional distribution data at the moment.';
          this.divisionMetrics = [];
        },
      });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedMedicine = null;
    this.divisionError = null;
    this.divisionMetrics = [];
    this.divisionLoading = false;
  }

  trackDivision(
    _index: number,
    metric: MedicationDivisionUsage
  ): string | number {
    return metric.divisionName ?? _index;
  }

  private fetchTopMedicines(): void {
    this.loading = true;
    this.error = null;

    this.adminPrescriptionService
      .getMostUsedMedications(this.pageNumber, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const items = response?.result ?? response?.results ?? [];
          this.pageItems = items;
          this.totalCount = response?.totalCount ?? items.length;

          if (!items.length) {
            this.error =
              response?.message ??
              'No medication usage data available right now.';
          }
        },
        error: () => {
          this.error = 'Unable to load medication usage details.';
          this.pageItems = [];
        },
      });
  }

  private computeTotalUsage(items: MedicationUsage[]): number {
    return items.reduce((sum, item) => sum + (item.usageCount ?? 0), 0);
  }
}
