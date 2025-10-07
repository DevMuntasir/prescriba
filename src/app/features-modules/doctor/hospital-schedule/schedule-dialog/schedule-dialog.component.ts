import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TosterService } from './../../../../shared/services/toster.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  form!: FormGroup;
  appointments!: FormGroup;
  sId: number = 0;
  formSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private TosterService: TosterService,
    @Inject(MAT_DIALOG_DATA) public editData: any | undefined
  ) {}

  ngOnInit(): void {
    this.form! = this.fb.group({
      appointments: this.fb.array([this.createAppointmentGroup()]),
    });
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  get days(): FormArray {
    return <FormArray>this.form.get('appointments');
  }

  addAppointmentRow(): void {
    this.days.push(this.createAppointmentGroup());
  }

  createAppointmentGroup() {
    this.sId = this.sId + 1;
    console.log(this.editData);

    if (this.editData.edit) {
      return this.fb.group({
        scheduleDayofWeek: [this.editData?.selectedDay, Validators.required],
        startTime: [this.editData.time.startTime, Validators.required],
        endTime: [this.editData.time.endTime, Validators.required],
        noOfPatients: [this.editData.time.noOfPatients, Validators.required],
        id: [this.uuidv4()],
      });
    } else {
      return this.fb.group({
        scheduleDayofWeek: [this.editData?.selectedDay, Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        noOfPatients: [
          '',
          [Validators.required, Validators.pattern('^(100|[1-9][0-9]?)$')],
        ],
        id: [this.uuidv4()],
      });
    }
  }

  removeAppointmentRow(index: number) {
    this.days.removeAt(index);
  }

  submit() {
    this.formSubmitted = true;
    if (!this.form.valid) {
      this.TosterService.customToast(
        'Please field all required field',
        'warning'
      );
      return;
    }
    this.TosterService.customToast('Session added', 'success');
    this.dialogRef.close({ ...this.form.value });
  }
}
