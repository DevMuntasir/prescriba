import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DataFilterModel, DoctorProfileDto, FilterModel } from 'src/app/proxy/dto-models/models';
import { DoctorProfileService } from 'src/app/proxy/services/doctor-profile.service';

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

  readonly filteredDoctors = computed<DoctorProfileDto[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.doctors();
    if (!term) {
      return items;
    }
    return items.filter((doctor) => {
      const haystack = [doctor.fullName, doctor.firstName, doctor.lastName, doctor.mobileNo, doctor.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  });

  ngOnInit(): void {
    this.fetchDoctors();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  trackById(_index: number, item: DoctorProfileDto): number | undefined {
    return item.id;
  }

  reload(): void {
    this.fetchDoctors();
  }

  getCreationTime(doctor: DoctorProfileDto): string | undefined {
    return (doctor as any)?.creationTime;
  }

  getLastUpdatedTime(doctor: DoctorProfileDto): string | undefined {
    const entity = doctor as any;
    return entity?.lastModificationTime ?? entity?.creationTime;
  }

  private fetchDoctors(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    const doctorFilter: DataFilterModel = {
      name: undefined,
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
        const result = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.items)
          ? ((response as any).items as DoctorProfileDto[])
          : [];
        this.doctorsSignal.set(result ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.doctorsSignal.set([]);
        this.isLoading.set(false);
        this.loadError.set('Unable to load doctors right now. Please try again later.');
      },
    });
  }
}
