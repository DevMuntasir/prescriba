import { HospitalStateService } from './../../../../shared/services/states/hospital-state.service';
import { DoctorChamberService } from './../../../../proxy/services/doctor-chamber.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { countries } from 'src/app/shared/utils/country';
import { DoctorChamberDto } from 'src/app/proxy/dto-models';
import { delay, map, of } from 'rxjs';

@Component({
  selector: 'app-hospital-dialog',
  templateUrl: './hospital-dialog.component.html',
  styleUrls: ['./hospital-dialog.component.scss'],
})
export class HospitalDialogComponent implements OnInit {
  form!: FormGroup;
  doctorId: any;
  error!: boolean;
  formSubmitted: boolean = false;
  countryList = countries;
  isLoading: boolean = false;
  isAbleVisiblePrescription!: boolean;
  showVisibilityMessage!: boolean;
  hospitalList: any;
  chamberList!: any[];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HospitalDialogComponent>,
    private DoctorChamberService: DoctorChamberService,
    private normalAuth: AuthService,
    private tosterService: TosterService,
    private HospitalStateService: HospitalStateService,
    @Inject(MAT_DIALOG_DATA)
    public editData:
      | {
          data: DoctorChamberDto;
          chamberList: DoctorChamberDto[];
        }
      | undefined
  ) {}

  ngOnInit(): void {
    let authInfo = this.normalAuth.authInfo();

    if (authInfo && authInfo.id) {
      this.loadForm(authInfo.id);
      this.getChamberList(authInfo.id);
      this.doctorId = authInfo.id;

      let isVisible = this.checkVisibilityStatusForPrescription(
        this.editData?.chamberList || []
      );
      if (isVisible) {
        this.showVisibilityMessage = true;
        this.form.get('isVisibleOnPrescription')?.disable();
      } else {
        this.showVisibilityMessage = false;
        this.form.get('isVisibleOnPrescription')?.enable();
      }
    }
    if (this.editData?.data) {
      this.form.patchValue(this.editData.data);
    }
  }
  chamberNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      return of(
        this.chamberList && this.chamberList.includes(control.value.trim())
      ).pipe(
        delay(300),
        map((isDuplicate) => {
          console.log(isDuplicate);
          return isDuplicate ? { chamberNameExists: true } : null;
        })
      );
    };
  }

  loadForm(id: any) {
    this.form = this.fb.group({
      doctorProfileId: [id, Validators.required],
      chamberName: [
        '',
        {
          validators: [Validators.pattern('^[a-zA-Z ]+$')],
          asyncValidators: [this.chamberNameValidator()],
          // updateOn: 'blur',
        },
      ],

      city: ['', Validators.required],
      country: ['Bangladesh', Validators.required],
      address: ['', Validators.required],
      zipCode: [''],
      isVisibleOnPrescription: [false],
    });
  }
  getChamberList(id: number) {
    this.DoctorChamberService.getDoctorChamberListByDoctorId(id)
      .pipe(
        map((res) => {
          if (res) {
            return res.map((c) => c.chamberName);
          }
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.chamberList = res;
        },
      });
  }
  submit() {
    this.formSubmitted = true;
    const { doctorProfileId, chamberName, city, country, address } =
      this.form.value;
    console.log(this.form.errors);

    if (this.form.invalid) return;
    if (!doctorProfileId || !chamberName || !city || !country || !address) {
      this.tosterService.customToast(
        'Please fill all the required fields!',
        'warning'
      );
      return;
    }
    this.isLoading = true;
    if (this.editData?.data) {
      this.DoctorChamberService.update({
        ...this.form.value,
        // doctorProfileId: this.doctorId,
        id: this.editData.data.id,
      }).subscribe({
        next: (res) => {
          this.tosterService.customToast('Successfully updated!', 'success');
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        error: () => {
          this.tosterService.customToast(
            'Something went wrong! Please contact your administrator.',
            'error'
          );
          this.isLoading = false;
          this.dialogRef.close(false);
        },
      });
    } else {
      this.DoctorChamberService.create(this.form.value).subscribe({
        next: (res) => {
          this.tosterService.customToast('Successfully updated!', 'success');
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        error: () => {
          this.tosterService.customToast(
            'Something went wrong! Please contact your administrator.',
            'error'
          );
          this.isLoading = false;
          this.dialogRef.close(false);
        },
      });
    }
  }
  checkVisibilityStatusForPrescription(list: DoctorChamberDto[]) {
    let count = 0;
    list.map((item) => {
      if (item.isVisibleOnPrescription && count < 2) {
        count++;
      }
    });

    return count >= 2 ? true : false;
  }
}
