import {
  PrescriptionPdfResponse,
  PrescriptionService,
} from './../../../shared/services/prescription/prescription.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { AuthService } from 'src/app/shared/services/auth.service';
import { prescriptionApi } from 'src/environments/environment';

@Component({
  selector: 'app-doctors-prescriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors-prescriptions.component.html',
  styleUrl: './doctors-prescriptions.component.scss',
})
export class DoctorsPrescriptionsComponent implements OnInit {
  private PrescriptionService = inject(PrescriptionService);
  private AuthService = inject(AuthService);
  format = format;
  prehandPrescriptions: PrescriptionPdfResponse['results'] = [];
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;
    let user = this.AuthService.authInfo();
    if (user.userType == 'doctor' && user.id) {
      this.PrescriptionService.getPreHandPrescriptionByDoctorId(
        user.id
      ).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.isLoading = false;
            this.prehandPrescriptions = res.results;
          } else {
            this.isLoading = false;
            this.prehandPrescriptions = [];
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
  showPdf(path: string) {
    const printWindow = window.open(`${prescriptionApi}/${path}`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }
}
