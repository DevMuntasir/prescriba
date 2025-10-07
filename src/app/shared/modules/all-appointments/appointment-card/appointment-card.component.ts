import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDto } from 'src/app/proxy/dto-models';
import { UploadAppointmentDocDialogComponent } from 'src/app/shared/components/upload-appointment-doc-dialog/upload-appointment-doc-dialog.component';
import { PrescriptionService } from 'src/app/shared/services/prescription/prescription.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { format } from 'date-fns';
import { prescriptionApi } from 'src/environments/environment';
import { ShowPrescriptionModalComponent } from '../../show-prescription-modal/show-prescription-modal.component';
import { PrescriptionMasterService } from 'src/app/proxy/services';

@Component({
  selector: 'appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.scss',
})
export class AppointmentCard implements OnChanges {
  date = new Date();
  formatDateTime = format;
  @Input() appointment: AppointmentDto = {} as AppointmentDto;
  @Input() user: string = 'doctor';
  @Output() completeAppointment = new EventEmitter();
  @Output() cancelAppointment = new EventEmitter();
  private Router = inject(Router);
  private TosterService = inject(TosterService);
  private PrescriptionService = inject(PrescriptionService);
  private PrescriptionMasterService = inject(PrescriptionMasterService);
  private dialog = inject(MatDialog);

  uploadPrescriptiion: boolean = false;
  btnDisable: boolean = false;
  prescriptionLoader: boolean = false;
  createPrescription(aptId: string | number | undefined) {
    if (aptId != null && aptId !== undefined) {
      this.Router.navigate(['/doctor/build-prescription'], {
        queryParams: { aptId },
      });
    } else {
      this.TosterService.customToast(
        'Appointment id is not available!',
        'error'
      );
    }
  }
  showPrescription(id: any): void {
    this.prescriptionLoader = true;
    this.PrescriptionService.getPrescriptionByAppointmentId(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.prescriptionLoader = false;
          const printWindow = window.open(
            `${prescriptionApi}/${res.results.filePath}`,
            '_blank'
          );
          if (printWindow) {
            this.prescriptionLoader = false;
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }
        } else {
          this.showOldPrescription(id);
        }
      },
    });
  }
  joinCall(apt: AppointmentDto, user: string) {
    let username =
      user == 'agent' || user == 'patient' ? apt.patientName : apt.doctorName;

    const client = user;
    const aptId = apt.id;
    const aptCode = apt.appointmentCode;
    console.log('call', client, aptId, aptCode, username, user);

    if (username && client && aptCode && aptId) {
      this.updateQueryParam({
        username: username,
        client: client,
        aptCode: aptCode,
        aptId: aptId,
      });
    }
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
  uploadDocuments(data: any) {
    this.dialog.open(UploadAppointmentDocDialogComponent, {
      width: '40vw',
      data,
    });
  }

  showOldPrescription(aptId: number) {
    this.PrescriptionMasterService.getPrescriptionByAppointmentId(
      aptId
    ).subscribe({
      next: (res) => {
        this.prescriptionLoader = false;
        if (res) {
          this.dialog.open(ShowPrescriptionModalComponent, {
            width: '40vw',
            data: res,
          });
        } else {
          this.TosterService.customToast('No Prescription Found!', 'error');
        }
      },
    });
  }

  ngOnChanges(): void {
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
}
