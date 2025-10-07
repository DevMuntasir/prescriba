import { countries } from './../../../../shared/utils/country';
import { TosterService } from 'src/app/shared/services/toster.service';

import { LoaderService } from './../../../../shared/services/loader.service';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorTitle, Gender, MaritalStatus } from 'src/app/proxy/enums';
import {
  DoctorProfileService,
  SpecialityService,
} from 'src/app/proxy/services';
import { ListItem } from 'src/app/shared/model/common-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { inputConfigs } from '../../../../shared/utils/input-info';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { customNameValidator } from 'src/app/shared/utils/auth-helper';
@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  form!: FormGroup;
  genderList: ListItem[] = [];
  titleList: ListItem[] = [];
  maritalOptions: ListItem[] = [];
  countryList = countries;
  specialties: any = [];
  formSubmitted: boolean = false;
  @Input() isLoading: boolean = false;
  doctorId: any;
  @Output() formDataEvent = new EventEmitter();
  @Output() profileData = new EventEmitter();
  receivedData: any;
  inputConfigs: any = inputConfigs;
  authInfo: any;
  constructor(
    private fb: FormBuilder,
    private doctorSpeciality: SpecialityService,
    private doctorProfileService: DoctorProfileService,
    private NormalAuth: AuthService,
    private datePipe: DatePipe,
    private LoaderService: LoaderService,
    private UserinfoStateService: UserinfoStateService,
    private TosterService: TosterService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.genderList = CommonService.getEnumList(Gender);
    this.maritalOptions = CommonService.getEnumList(MaritalStatus);
    this.titleList = CommonService.getEnumList(DoctorTitle);
    this.doctorSpeciality.getList().subscribe((res) => {
      this.specialties = res;
    });
    let authId = this.NormalAuth.authInfo().id;

    this.doctorId = authId;
    this.fetchProfileInfo(authId);
  }
  fetchProfileInfo(doctorId: any): void {
    // this.LoaderService.sendLoaderState(true);
    if (!doctorId) {
      // this.LoaderService.sendLoaderState(false);
      return;
    }

    this.UserinfoStateService.getData().subscribe(
      (profileInfo) => {
        this.authInfo = profileInfo;
        profileInfo.dateOfBirth = this.formatDate(profileInfo.dateOfBirth); // Format the date of birth
        profileInfo.bmdcRegExpiryDate = this.formatDate(
          profileInfo.bmdcRegExpiryDate
        ); // Format the BMDC expiry date
        this.form?.patchValue(profileInfo);
        this.profileData.emit(profileInfo);
        this.form.get('specialityId')?.patchValue(profileInfo.specialityId);
        this.form.get('isActive')?.setValue(profileInfo.isActive);
        this.LoaderService.sendLoaderState(false);
      },
      (error) => {
        this.LoaderService.sendLoaderState(false);
        console.error('Error fetching profile information:', error);
      }
    );
  }
  private formatDate(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  loadForm() {
    this.form = this.fb.group({
      // firstName: [''],
      // lastName: [''],
      // maritalStatus: ['', Validators.required],
      // mobileNo: [''],
      doctorTitle: [''],
      fullName: [''],
      email: [
        '',
        [Validators.pattern(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)],
      ],
      gender: [''],
      dateOfBirth: [''],
      city: [''],
      country: ['Bangladesh'],
      address: [''], //[Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      zipCode: [''], //[Validators.required, Validators.pattern(/^\d{4}$/)]],
      bmdcRegNo: [''],
      bmdcRegExpiryDate: [''],
      specialityId: ['', Validators.required],
      identityNumber: [''],
      isActive: [false],
    });
  }
  sendDataToParent() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.TosterService.customToast('Fill all the requirements', 'warning');
      return;
    }
    this.formDataEvent.emit({ ...this.form.value, id: this.doctorId });
  }
}
