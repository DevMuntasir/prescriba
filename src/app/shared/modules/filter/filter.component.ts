import { AuthService } from './../../services/auth.service';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterInputModel } from '../../utils/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FilterComponent implements OnInit {
  @Input() filterForm!: FormGroup;
  @Input() filterInput!: FilterInputModel;
  @Input() from = '';
  selectedConsultancy = '';
  userType: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.userType = this.AuthService.authInfo()?.userType;
    this.filterForm
      .get('consultancy')
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
    this.route.queryParams.subscribe((params) => {
      const name = params['doctorname'];
      const appointmentSearch =
        this.userType == 'doctor'
          ? params['apt-patientname']
          : params['apt-patientname'];
      const consultancy = params['consultancyType'];
      const appointmentType = params['appointmentType'];
      const specialization = params['specialization'];
      this.filterForm.get('search')?.setValue(name);
      this.filterForm.get('appointmentSearch')?.setValue(appointmentSearch);
      this.filterForm.get('consultancy')?.setValue(consultancy);
      this.filterForm.get('appointmentType')?.setValue(appointmentType);
      this.filterForm.get('specialization')?.setValue(specialization);
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
      ?.valueChanges.pipe(debounceTime(500))
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

  getFormControlsFields() {
    const formGroupFields: any = {};
    formGroupFields['search'] = new FormControl('');
    formGroupFields['appointmentSearch'] = new FormControl('');
    for (const field of this.filterInput.fields.filterField) {
      if (typeof field.formControlName === 'string') {
        formGroupFields[field.formControlName] = new FormControl('');
      } else {
        formGroupFields[field.formControlName.endDate] = new FormControl('');
        formGroupFields[field.formControlName.startDate] = new FormControl('');
      }
    }
    return formGroupFields;
  }

  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.filterForm = new FormGroup(formGroupFields);
  }

  // updateQueryParam(paramName: string, paramValue: any) {
  //   const currentParams = { ...this.route.snapshot.queryParams };
  //   currentParams[paramName] = paramValue;
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: currentParams,
  //     queryParamsHandling: 'merge',
  //     replaceUrl: true,
  //   });
  // }

  updateQueryParam(key: string, value: string | null): void {
    const queryParams = value ? { [key]: value } : { [key]: null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Retains other query parameters
    });
  }
}
