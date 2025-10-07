import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorDegreeService } from '../../../../proxy/services/doctor-degree.service';
import { DoctorDegreeDto } from 'src/app/proxy/dto-models';
import { DegreeService } from '../../../../proxy/services/degree.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-degree-dialog',
  templateUrl: './degree-dialog.component.html',
  styleUrls: ['./degree-dialog.component.scss'],
})
export class DegreeDialogComponentnt implements OnInit {
  isLoading: boolean = false;
  degreeList: DoctorDegreeDto[] = [];
  durationList: any = [
    { id: 1, name: '1 year' },
    { id: 2, name: '2 year' },
    { id: 3, name: '3 year' },
    { id: 4, name: '4 year' },
    { id: 5, name: '5 year' },
  ];
  form!: FormGroup;
  doctorId: any;
  disable: boolean = false;
  constructor(
    private degreeService: DegreeService,
    private fb: FormBuilder,
    private doctorDegreeService: DoctorDegreeService,
    private normalAuth: AuthService,
    public dialogRef: MatDialogRef<DegreeDialogComponentnt>,
    private tosterService: TosterService,
    @Inject(MAT_DIALOG_DATA)
    public editData: any
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.degreeService.getList().subscribe((res) => {
      this.degreeList = res;
      this.checkPrescriptionLimit();
    });
    this.doctorId = this.normalAuth.authInfo().id;
    if (this.editData?.data) {
      this.form.patchValue(this.editData.data);
    }
  }

  loadForm() {
    this.form = this.fb.group({
      zipCode: ['1216'],
      degreeId: ['', Validators.required],
      duration: ['', Validators.required],
      durationType: ['', Validators.required],
      passingYear: ['', Validators.required],
      instituteName: ['', Validators.required],
      instituteCity: ['', Validators.required],
      instituteCountry: ['', Validators.required],
      isPrescriptionShow: [false],
    });
  }

  sendDataToParent() {
    let degreeId = this.form.get('degreeId')?.value;
    let duration = this.form.get('duration')?.value;
    const newDegreeData = {
      ...this.form.value,
      degreeId: Number(degreeId),
      duration: Number(duration),
      doctorProfileId: this.doctorId,
    };

    if (!this.form.valid && !this.form.touched) {
      this.tosterService.customToast(
        'Please fill all the required fields!',
        'warning'
      );
      return;
    }

    if (!this.editData.data) {
      this.doctorDegreeService.create(newDegreeData).subscribe((res) => {
        if (res) {
          this.tosterService.customToast('Successfully added!', 'success');
          this.dialogRef.close(true);
        }
      });
    } else {
      let changedProperties: string[] = [];
      let exData: any = this.editData.data;
      for (const key in newDegreeData) {
        if (
          newDegreeData.hasOwnProperty(key) &&
          newDegreeData[key] !== exData[key]
        ) {
          changedProperties.push(key);
        }
      }

      if (changedProperties.length < 1) {
        this.dialogRef.close(false);
        return;
      } else {
        this.doctorDegreeService
          .update({ ...newDegreeData, id: this.editData.data.id })
          .subscribe((res) => {
            if (res) {
              this.tosterService.customToast(
                'Successfully updated!',
                'success'
              );
              this.dialogRef.close(true);
            } else {
              this.tosterService.customToast(
                'Something went wrong! Please contact your administrator.',
                'error'
              );
              this.dialogRef.close(false);
            }
          });
      }
    }
  }
  checkPrescriptionLimit() {
    const count = this.editData?.educationList?.filter(
      (res: any) => res.isPrescriptionShow
    ).length;
    if (count >= 4 && !this.editData?.data?.isPrescriptionShow) {
      console.log('big');

      this.form.get('isPrescriptionShow')?.disable();
    } else {
      console.log('sm');

      this.form.get('isPrescriptionShow')?.enable();
    }
  }
}
