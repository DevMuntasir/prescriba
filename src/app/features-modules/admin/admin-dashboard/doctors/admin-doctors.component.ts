import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DataFilterModel, DoctorProfileDto, FilterModel } from 'src/app/api/dto-models/models';
import { DoctorProfileService } from 'src/app/api/services/doctor-profile.service';

interface DoctorListMetrics {
  readonly total: number;
  readonly active: number;
  readonly online: number;
}

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.scss'],
})
export class AdminDoctorsComponent implements OnInit {
  private readonly doctorService = inject(DoctorProfileService);

  private readonly doctorsSignal = signal<DoctorProfileDto[]>([]);
  readonly doctors = this.doctorsSignal.asReadonly();

  readonly isLoading = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);
  readonly searchTerm = signal<string>('');

  readonly metrics = computed<DoctorListMetrics>(() => {
    const items = this.doctors();
    const total = items.length;
    const active = items.filter((item) => item.isActive).length;
    const online = items.filter((item) => item.isOnline).length;
    return { total, active, online };
  });

  ngOnInit(): void {
    this.fetchDoctors();
  }

  onSearch(term: string): void {
    const normalized = term?.trim() ?? '';
    if (normalized === this.searchTerm()) {
      return;
    }
    this.searchTerm.set(normalized);
    this.fetchDoctors(normalized || undefined);
  }

  trackById(_index: number, item: DoctorProfileDto): number | undefined {
    return item.id;
  }

  reload(): void {
    const currentTerm = this.searchTerm();
    this.fetchDoctors(currentTerm || undefined);
  }

  getCreationTime(doctor: DoctorProfileDto): string | undefined {
    return (doctor as any)?.creationTime;
  }

  getLastUpdatedTime(doctor: DoctorProfileDto): string | undefined {
    const entity = doctor as any;
    return entity?.lastModificationTime ?? entity?.creationTime;
  }

  private fetchDoctors(searchName?: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    const normalized = searchName?.trim() ?? '';
    const requestName = normalized || undefined;

    const doctorFilter: DataFilterModel = {
      name: requestName,
      consultancyType: undefined,
      specialityId: undefined,
      specializationId: undefined,
      appointmentStatus: undefined,
      appointmentType: undefined,
      fromDate: undefined,
      toDate: undefined,
      isCurrentOnline: undefined,
      isActive: undefined,
      scheduleId: undefined,
      day: undefined,
      export: false,
    };

    const pagination: FilterModel = {
      offset: 0,
      limit: 50,
      pageNo: 1,
      pageSize: 50,
      sortBy: 'creationTime',
      sortOrder: 'DESC',
      isDesc: true,
    };

    this.doctorService.getDoctorListFilterByAdmin(doctorFilter, pagination).subscribe({
      next: (response) => {
        if (this.searchTerm() !== normalized) {
          return;
        }
        const result = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.items)
          ? ((response as any).items as DoctorProfileDto[])
          : [];
        this.doctorsSignal.set(result ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        if (this.searchTerm() !== normalized) {
          return;
        }
        this.doctorsSignal.set([]);
        this.isLoading.set(false);
        this.loadError.set('Unable to load doctors right now. Please try again later.');
      },
    });
  }
}
