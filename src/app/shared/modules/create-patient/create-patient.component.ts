import { UserinfoStateService } from './../../services/states/userinfo-state.service';
import { PatientProfileService } from './../../../proxy/services/patient-profile.service';
import { TosterService } from './../../services/toster.service';
import { inputForCreatePatient } from './../../utils/input-info';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Gender } from 'src/app/proxy/enums';
import { ListItem } from '../../model/common-model';
import { map, switchMap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss'],
})
export class CreatePatientComponent implements OnInit {
  createPatientForm!: FormGroup;
  inputConfigs: any = inputForCreatePatient;
  isLoading: boolean = false;
  profileInfo: any;
  formSubmitted: boolean = false;
  btnLoader: boolean = false;
  genderList: ListItem[] = [];
  authInfo: any;
  constructor(
    private fb: FormBuilder,
    private TosterService: TosterService,
    private UserinfoStateService: UserinfoStateService,
    private PatientProfileService: PatientProfileService,
    private NormalAuth: AuthService,
    public dialogRef: MatDialogRef<CreatePatientComponent>
  ) {}
  ngOnInit(): void {
    let user = this.NormalAuth.authInfo();
    this.authInfo = user;
    this.genderList = CommonService.getEnumList(Gender);
    this.loadForm();
    if (user) {
      this.createPatientForm.get('creatorEntityId')?.setValue(user.id);
      this.createPatientForm.get('createdBy')?.setValue(user.fullName);
    }
    return;
  }
  loadForm() {
    this.createPatientForm = this.fb.group({
      patientName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['0', Validators.required],
      bloodGroup: ['0', Validators.required],
      patientMobileNo: ['', Validators.required],
      patientEmail: [''],
      createdBy: ['', Validators.required],
      creatorEntityId: ['', Validators.required], //userType: "patient"
      creatorRole: [this.authInfo.userType, Validators.required],
    });
  }

  createNewPatient(): void {
    this.formSubmitted = true;

    if (
      !this.createPatientForm.valid &&
      (this.createPatientForm.get('bloodGroup')?.value === '0' ||
        this.createPatientForm.get('gender')?.value === '0')
    ) {
      this.TosterService.customToast(
        'Please field all the required fields',
        'warning'
      );
      return;
    }

    try {
      this.btnLoader = true;
      this.PatientProfileService.create(this.createPatientForm.value).subscribe(
        (res) => {
          if (res.patientCode && res.patientMobileNo) {
            this.PatientProfileService.getByPhoneAndCode(
              res.patientCode,
              res.patientMobileNo
            ).subscribe({
              next: (res) => {
                console.log(res);
                //TODO
                // this.UserinfoStateService.getUserPatientInfo(res.id, this.authInfo.userType);
                this.TosterService.customToast(
                  'Your patient is created!',
                  'success'
                );
                this.btnLoader = false;

                this.UserinfoStateService.getUserPatientInfo(
                  this.authInfo.id,
                  this.authInfo.userType
                );
                this.dialogRef.close();
              },
              error: (err) => {
                this.TosterService.customToast(
                  'Something went wrong!',
                  'error'
                );
                this.btnLoader = false;
              },
            });
          }
        }
      );
    } catch (error) {
      this.TosterService.customToast('Something wrong! Please retry', 'error');
      this.btnLoader = false;
    }
  }
}
