import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription/prescription.service';

import { AppointmentDto } from 'src/app/proxy/dto-models';
import { AppointmentService } from 'src/app/proxy/services';
import { prescriptionApi } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { UploadAppointmentDocDialogComponent } from '../upload-appointment-doc-dialog/upload-appointment-doc-dialog.component';
import { TosterService } from './../../../shared/services/toster.service';

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
})
export class AppointmentCardComponent implements AfterViewInit {
  @Input() appointment: AppointmentDto = {} as AppointmentDto;
  @Input() user: any;
  @Output() completeAppointment = new EventEmitter();
  @Output() cancelAppointment = new EventEmitter();

  uploadPrescriptiion: boolean = true;
  btnDisable: boolean = false;
  constructor(
    private Router: Router,
    public dialog: MatDialog,
    private AppointmentService: AppointmentService,
    private tosterService: TosterService,
    private NormalAuth: AuthService,
    private PrescriptionService: PrescriptionService
  ) {
    this.btnDisable = false;
  }

  ngAfterViewInit(): void {
    const currentDate = new Date();
    const appointmentDate = new Date(this.appointment.appointmentDate || '');

    currentDate.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate.getTime() >= currentDate.getTime()) {
      this.uploadPrescriptiion = true;
    } else {
      this.uploadPrescriptiion = false;
    }

    if (appointmentDate.getTime() < currentDate.getTime()) {
      this.btnDisable = true;
    } else {
      this.btnDisable = false;
    }
  }

  goToBuildPrescription(aptId: string | number | undefined) {
    if (aptId != null && aptId !== undefined) {
      this.Router.navigate(['/doctor/build-prescription'], {
        queryParams: { aptId },
      });
    } else {
      this.tosterService.customToast(
        'Appointment id is not available!',
        'error'
      );
    }
  }

  goToPatientProfile(appointment: any) {
    this.Router.navigate([
      '/doctor/patients/patient-details/',
      appointment.patientProfileId,
    ]);
  }

  openPdfDialog(id: any): void {
    this.PrescriptionService.getPrescriptionByAppointmentId(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const printWindow = window.open(
            `${prescriptionApi}/${res.results.filePath}`,
            '_blank'
          );
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }
        } else {
          this.tosterService.customToast(
            'Prescription not available!',
            'error'
          );
        }
      },
    });
  }

  goToJoinCall(apt: any, user: string) {
    // const url = `https://agora-video-call-eight.vercel.app/?username=${'username'}&aptCode=${apt}&c=${user}`;
    // // window.location.href = url;
    // window.open(url, '_blank');
    // return

    if (apt) {
      const currentDate = new Date();
      const appointmentDate = new Date(apt.appointmentDate);
      // currentDate.setHours(13);
      // currentDate.setMinutes(35);

      const appointmentTime = {
        hour: +apt.appointmentTime.split(':')[0],
        minute: +apt.appointmentTime.split(':')[1],
      };

      if (
        currentDate.getFullYear() <= appointmentDate.getFullYear() &&
        currentDate.getMonth() <= appointmentDate.getMonth() &&
        currentDate.getDate() <= appointmentDate.getDate()
      ) {
        if (
          currentDate.getFullYear() === appointmentDate.getFullYear() &&
          currentDate.getMonth() === appointmentDate.getMonth() &&
          currentDate.getDate() === appointmentDate.getDate()
        ) {
          //   console.log('Today is appointment date');

          // 15min age user can join
          const getTimeDifference = (
            aptHour: number,
            aptMinute: number,
            currentHour: number,
            currentMinute: number
          ) => {
            console.log({
              aptMinute,
              aptHour,
              currentHour,
              currentMinute,
            });
            if (aptMinute < 15) {
              aptMinute += 60;
              aptHour -= 1;
            }

            const hourDiff = aptHour - currentHour;
            const minuteDiff = aptMinute - currentMinute;

            // console.log(hourDiff);
            // console.log(minuteDiff);

            return hourDiff * 60 + minuteDiff;
          };
          const timeDiff = getTimeDifference(
            appointmentTime.hour,
            appointmentTime.minute,
            currentDate.getHours(),
            currentDate.getMinutes()
          );

          if (timeDiff < 15 && timeDiff > -30) {
            console.log('Appointment will start soon!');
            let username = apt.doctorName;
            const client = user;
            const aptId = apt.id;
            const aptCode = apt.appointmentCode;
            this.updateQueryParam({ username, client, aptCode, aptId });
            if (client == 'doctor') {
              username = apt.doctorName;
            } else {
              username = apt.patientName;
            }
          } else if (timeDiff > 15) {
            this.openDialog('Appointment time is not here yet!');
            //  console.log('Appointment time is not here yet!');
          } else {
            this.openDialog('Appointment time is over!');
            //  console.log('Appointment time is over!');
            // this.uploadPrescriptiion = false;
          }
        } else {
          this.openDialog('Appointment date is coming soon!');
          // console.log('Appointment date is coming soon!');
        }
      } else {
        this.openDialog('Appointment date is over!');
        // console.log('Appointment date is over!');
        // this.uploadPrescriptiion = false;
      }
    }
  }

  uploadDocuments(data: any) {
    this.dialog.open(UploadAppointmentDocDialogComponent, {
      width: '40vw',
      data: data?.patientProfileId,
    });
  }

  openDialog(data: string): void {
    this.dialog.open(AppointmentDialogComponent, {
      width: '40vw',
      data: data,
    });
  }

  updateQueryParam(params: {
    username: string;
    client: string;
    aptCode: string;
    aptId: number;
  }) {
    let route = 'video-consultation';

    this.Router.navigate([`${route}`], {
      queryParams: params,
    });
  }
}
