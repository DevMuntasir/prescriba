import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppointmentStatsComponent } from '../appointment-stats/appointment-stats.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { DoctorScheduleService } from 'src/app/proxy/services';
import { DoctorScheduleDto } from 'src/app/proxy/dto-models';
import { MatRadioModule } from '@angular/material/radio';
@Component({
  selector: 'appointment-filter',
  standalone: true,
  imports: [AppointmentStatsComponent, ReactiveFormsModule, MatRadioModule],
  templateUrl: './appointment-filter.component.html',
  styleUrl: './appointment-filter.component.scss',
})
export class AppointmentFilterComponent implements OnInit {
  filterForm!: FormGroup;
  @ViewChild('scheduleId') scheduleId!: ElementRef;
  private fb = inject(FormBuilder);
  private Router = inject(Router);
  private ActiveRoute = inject(ActivatedRoute);
  private AuthService = inject(AuthService);
  private DoctorScheduleService = inject(DoctorScheduleService);
  userType: any;
  ScheduleList: DoctorScheduleDto[] = [];
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      appointmentType: [''],
      consultancyType: [''],
      scheduleId: [''],
      specialization: [''],
      startDate: [''],
      day: [''],
      endDate: [''],
      search: [''],
      appointmentSearch: [''],
    });

    this.userType = this.AuthService.authInfo()?.userType;
    this.getScheduleList(this.AuthService.authInfo()?.id);
    this.filterForm
      .get('consultancyType')
      ?.valueChanges.subscribe((consultancy) => {
        this.updateQueryParam('consultancyType', consultancy);
      });

    this.filterForm
      .get('appointmentType')
      ?.valueChanges.subscribe((appointmentType) => {
        this.updateQueryParam('appointmentType', appointmentType);
      });

    this.filterForm
      .get('specialization')
      ?.valueChanges.subscribe((specialization) => {
        this.updateQueryParam('specialization', specialization);
      });

    this.filterForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.updateQueryParam('startDate', startDate);
    });
    this.filterForm.get('endDate')?.valueChanges.subscribe((endDate) => {
      this.updateQueryParam('endDate', endDate);
    });
    this.filterForm.get('scheduleId')?.valueChanges.subscribe((scheduleId) => {
      this.updateQueryParam('scheduleId', scheduleId);
    });
    this.filterForm.get('day')?.valueChanges.subscribe((day) => {
      this.updateQueryParam('day', day);
    });
    this.ActiveRoute.queryParams.subscribe((params) => {
      const name = params['doctorname'];
      const appointmentSearch =
        this.userType == 'doctor'
          ? params['apt-patientname']
          : params['apt-patientname'];
      const consultancy = params['consultancyType'];
      const appointmentType = params['appointmentType'];
      const specialization = params['specialization'];
      const scheduleId = params['scheduleId'];
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      const day = params['day'];

      this.filterForm.get('search')?.setValue(name);
      this.filterForm
        .get('appointmentSearch')
        ?.setValue(appointmentSearch ?? '');

      this.filterForm.get('consultancyType')?.setValue(consultancy ?? '');
      this.filterForm.get('appointmentType')?.setValue(appointmentType ?? '');
      this.filterForm.get('specialization')?.setValue(specialization ?? '');
      this.filterForm.get('scheduleId')?.setValue(scheduleId ?? '');
      this.filterForm.get('startDate')?.setValue(startDate ?? '');
      this.filterForm.get('endDate')?.setValue(endDate ?? '');
      this.filterForm.get('day')?.setValue(day ?? '');
    });
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (text) => {
          this.updateQueryParam('doctorname', text);
          if (!text) {
            this.updateQueryParam('doctorname', null);
          }
        },
      });

    this.filterForm
      .get('appointmentSearch')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (text) => {
          if (this.userType == 'patient') {
            this.updateQueryParam('apt-doctorname', text);
            if (!text) {
              this.updateQueryParam('apt-doctorname', null);
            }
          } else {
            this.updateQueryParam('apt-patientname', text);
            if (!text) {
              this.updateQueryParam('apt-patientname', null);
            }
          }
        },
      });
  }
  updateQueryParam(
    key: string,
    value: string | null,
    setDefaults: boolean = true
  ): void {
    const currentParams = { ...this.ActiveRoute.snapshot.queryParams };

    if (
      (key === 'consultancyType' && value === '2') ||
      (key === 'consultancyType' && value == '5')
    ) {
      delete currentParams['scheduleId'];
      this.filterForm.get('scheduleId')?.setValue('');
    }

    if (value === null || value === '') {
      delete currentParams[key];
    } else {
      currentParams[key] = value;
    }

    this.Router.navigate([], {
      relativeTo: this.ActiveRoute,
      queryParams: currentParams,
    });
  }

  getScheduleList(id: number) {
    this.DoctorScheduleService.getScheduleListByDoctorId(id)
      .pipe(
        map((res: DoctorScheduleDto[]) => {
          const uniqueChambers = new Set();
          return res?.filter((schedule) => {
            if (schedule.chamber && !uniqueChambers.has(schedule.chamber)) {
              uniqueChambers.add(schedule.chamber);
              return true;
            }
            return false;
          });
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.ScheduleList = res;
          } else {
            this.ScheduleList = [];
          }
        },
        error: (err) => {
          console.error('Error fetching schedule list:', err);
        },
      });
  }
  resetFilters() {
    this.filterForm.reset({
      appointmentType: '',
      consultancyType: '',
      scheduleId: '',
      specialization: '',
      startDate: '',
      endDate: '',
      search: '',
      appointmentSearch: '',
    });

    this.Router.navigate([], {
      relativeTo: this.ActiveRoute,
      queryParams: {},
    });
  }
}
