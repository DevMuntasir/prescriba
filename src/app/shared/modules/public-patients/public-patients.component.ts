import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppointmentService } from 'src/app/api/services';
import { AuthService } from '../../services/auth.service';
import { UserinfoStateService } from '../../services/states/userinfo-state.service';
import { PatientProfileService } from './../../../api/services/patient-profile.service';

@Component({
  selector: 'app-public-patients',
  templateUrl: './public-patients.component.html',
  styleUrls: ['./public-patients.component.scss'],
})
export class PublicPatientsComponent implements OnInit {
  patientList: any[] = [];
  filteredPatientList: any[] = [];
  patientLoader: boolean = false;
  userInfo: any;
  gender = ['Male', 'Female', 'Others'];
  searchField = new FormControl('');
  private ActiveRoute = inject(ActivatedRoute);
  constructor(
    private Router: Router,
    private AppointmentService: AppointmentService,
    private NormalAuth: AuthService,
    public dialog: MatDialog,
    private PatientProfileService: PatientProfileService,
    private UserinfoStateService: UserinfoStateService
  ) {}
  ngOnInit(): void {
    let user = this.NormalAuth.authInfo();

    this.searchField.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe({
        next: (text) => {
          this.pageNumber = 1;
          this.patientList = []; // Clear old list
          this.updateQueryParam('search', text);
          this.getPatientList(this.userInfo, String(text));
          if (!text) {
            this.updateQueryParam('search', null);
          }
        },
      });
    this.userInfo = user;
    this.getPatientList(user, '');
  }

  goToPatientProfile(patient: any) {
    if (this.userInfo.userType === 'doctor') {
      this.Router.navigate([
        '/doctor/patients/patient-details/',
        patient.patientProfileId,
      ]);
    } else if (this.userInfo.userType === 'patient') {
      this.Router.navigate(['/patient/my-family/patient-details/', patient.id]);
    } else if (this.userInfo.userType === 'agent') {
      this.Router.navigate(['/agent/patients/patient-details/', patient.id]);
    }
    return;
  }
  pageNumber: number = 1;
  addNewPatient() {

  }
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef;

  getPatientList(user: any, search: string) {
    if (user?.id) {
      this.patientLoader = true;

      try {
        if (user.userType === 'doctor') {
          this.AppointmentService.getPatientsByDoctorId(user.id, {
            searchTerm: search,
            pageNumber: this.pageNumber,
            pageSize: 10,
          }).subscribe((res) => {
            if (this.pageNumber === 1) {
              this.patientList = res.results;
            } else {
              this.patientList = [...this.patientList, ...res.results];
            }
            this.patientLoader = false;
          });
        }
        // বাকিগুলো যদি শুধু প্রথম পেজ লাগে, একইভাবে হ্যান্ডেল করা যাবে।
      } catch (error) {
        this.patientLoader = false;
      }
    }
  }

  updateQueryParam(key: string, value: string | null): void {
    const currentParams = { ...this.ActiveRoute.snapshot.queryParams };

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
  onScrollDown() {
    let user = this.NormalAuth.authInfo();
    this.pageNumber = this.pageNumber + 1;
    this.getPatientList(user, this.searchField.value || '');
  }
}
