import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PrescriptionMasterDto } from 'src/app/api/dto-models/models';
import { PrescriptionMasterService } from 'src/app/api/services/prescription-master.service';

interface PrescriptionSummary {
  readonly total: number;
  readonly issuedThisWeek: number;
  readonly followUpsDue: number;
  readonly uniqueDoctors: number;
}

@Component({
  selector: 'app-admin-prescriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-prescriptions.component.html',
  styleUrls: ['./admin-prescriptions.component.scss'],
})
export class AdminPrescriptionsComponent implements OnInit {
  private readonly prescriptionService = inject(PrescriptionMasterService);

  private readonly prescriptionsSignal = signal<PrescriptionMasterDto[]>([]);
  readonly prescriptions = this.prescriptionsSignal.asReadonly();

  readonly isLoading = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);

  readonly summary = computed<PrescriptionSummary>(() => {
    const items = this.prescriptions();
    const total = items.length;
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);

    const issuedThisWeek = items.filter((item) => {
      const date = this.parseDate(item.prescriptionDate) ?? this.parseDate((item as any).creationTime);
      return !!date && date >= sevenDaysAgo && date <= now;
    }).length;

    const followUpsDue = items.filter((item) => {
      const followUp = this.parseDate(item.followupDate);
      return !!followUp && followUp >= now && followUp <= sevenDaysLater;
    }).length;

    const uniqueDoctors = new Set(
      items
        .map((item) => item.doctorProfileId ?? item.doctorName ?? item.doctorCode)
        .filter((value) => value !== undefined && value !== null)
    ).size;

    return { total, issuedThisWeek, followUpsDue, uniqueDoctors };
  });

  ngOnInit(): void {
    this.fetchPrescriptions();
  }

  trackById(_index: number, item: PrescriptionMasterDto): number | undefined {
    return item.id ?? item.appointmentId;
  }

  reload(): void {
    this.fetchPrescriptions();
  }

  private fetchPrescriptions(): void {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.prescriptionService.getList().subscribe({
      next: (response) => {
        const result = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.items)
          ? ((response as any).items as PrescriptionMasterDto[])
          : [];
        this.prescriptionsSignal.set(result ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Unable to load prescriptions at the moment. Please try again shortly.');
        this.prescriptionsSignal.set([]);
      },
    });
  }

  private parseDate(value?: string | null): Date | undefined {
    if (!value) {
      return undefined;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
}
