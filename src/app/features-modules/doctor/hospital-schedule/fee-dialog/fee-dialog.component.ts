import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorFeeSetupService } from './../../../../proxy/services/doctor-fee-setup.service';

import { AppointmentType } from 'src/app/proxy/enums';
import { DoctorScheduleService } from 'src/app/proxy/services';
import { ListItem } from 'src/app/shared/model/common-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorFeesSetupDto } from 'src/app/proxy/dto-models';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fee-dialog',
  templateUrl: './fee-dialog.component.html',
  styleUrls: ['./fee-dialog.component.scss'],
})
export class FeeDialogComponent implements OnInit {
  form!: FormGroup;
  doctorId: any;
  feesData: any;
  scheduleType: any;
  formSubmitted: boolean = false;
  appointmentType: ListItem[] = [
    {
      id: AppointmentType.New,
      name: 'New',
    },
    {
      id: AppointmentType.Followup,
      name: 'Followup',
    },
  ];
  doctorSchedule: any[] = [];
  hideElement: any;
  showFollowUpPeriod: boolean = true;
  showReportShowPeriod: boolean = true;
  feeList: DoctorFeesSetupDto[] = [];
  selectedAppointmentType!: string;
  destroy$ = new Subject<void>();
  isEditing: boolean = false;
  private skipScheduleFilter = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FeeDialogComponent>,
    private normalAuth: AuthService,
    private tosterService: TosterService,
    private DoctorScheduleService: DoctorScheduleService,
    private DoctorFeeSetupService: DoctorFeeSetupService,
    @Inject(MAT_DIALOG_DATA) public editData: any | undefined
  ) {}

  ngOnInit(): void {
    const authInfo = this.normalAuth.authInfo();
    if (authInfo?.id) {
      this.doctorId = authInfo.id;
      this.initializeForm();

      if (this.editData?.id) {
        this.isEditing = true;
        this.loadEditData();
      }

      this.getScheduleList();
      this.getFeeList();
    }

    this.form
      .get('discount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateTotalFee());

    this.form
      .get('currentFee')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateTotalFee());

    this.form
      .get('appointmentType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.selectedAppointmentType = AppointmentType[value];
        if (!this.isEditing) {
          this.getScheduleList();
        }
      });
  }

  initializeForm() {
    this.form = this.fb.group({
      appointmentType: ['', Validators.required],
      doctorScheduleId: ['', Validators.required],
      currentFee: ['', Validators.required],
      discount: [0],
      totalFee: ['', Validators.required],
      feeAppliedFrom: ['02/01/2023'],
    });
  }

  loadEditData() {
    this.DoctorFeeSetupService.get(this.editData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res.doctorScheduleId);

        this.selectedAppointmentType =
          AppointmentType[res.appointmentType ?? 1];
        this.form.patchValue({
          ...res,
          feeAppliedFrom: res.feeAppliedFrom || '02/01/2023',
          appointmentType: res.appointmentType,
          doctorScheduleId: res.doctorScheduleId,
        });
      });
  }

  getFeeList() {
    this.DoctorFeeSetupService.getListByDoctorIdList(this.doctorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.feeList = res;
      });
  }

  getScheduleList() {
    this.DoctorScheduleService.getScheduleListByDoctorId(this.doctorId)
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          const doctorSchedule = res.map((e) => ({
            name: e.scheduleName,
            id: e.id,
          }));

          // No filtering when skipping (during edit)
          if (this.skipScheduleFilter) return doctorSchedule;

          return doctorSchedule.filter((schedule) => {
            return !this.feeList.some(
              (fee) =>
                fee.doctorScheduleName === schedule.name &&
                this.selectedAppointmentType === fee.appointmentTypeName &&
                fee.id !== this.editData?.id
            );
          });
        })
      )
      .subscribe((filteredSchedules) => {
        this.doctorSchedule = filteredSchedules;
      });
  }

  calculateTotalFee() {
    const currentFee = this.form.get('currentFee')?.value || 0;
    const discount = this.form.get('discount')?.value || 0;
    const total = currentFee - discount;
    this.form.patchValue({ totalFee: total });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);

      if (this.editData?.id) {
        this.DoctorFeeSetupService.update({
          ...this.form.value,
          id: this.editData.id,
        })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      } else {
        this.DoctorFeeSetupService.create(this.form.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
