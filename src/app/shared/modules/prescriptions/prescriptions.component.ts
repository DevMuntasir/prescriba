import { TosterService } from './../../services/toster.service';
import { PrescriptionMasterService } from './../../../proxy/services/prescription-master.service';
import { Component, OnInit } from '@angular/core';
import { PrescriptionMasterDto } from 'src/app/proxy/dto-models';
import { ShowPrescriptionModalComponent } from '../show-prescription-modal/show-prescription-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
})
export class PrescriptionsComponent implements OnInit {
  prescriptionListDetails: any;
  isLoading = {
    status: false,
    message: '',
  };
  constructor(
    private NormalAuth: AuthService,
    public dialog: MatDialog,
    private PrescriptionMasterService: PrescriptionMasterService,
    private TosterService: TosterService
  ) {}
  ngOnInit(): void {
    this.isLoading = {
      status: true,
      message: 'Data is loading...',
    };
    let patientId = this.NormalAuth.authInfo();
    try {
      this.PrescriptionMasterService.getPrescriptionMasterListByPatientId(
        patientId.id
      ).subscribe({
        next: (res) => {
          this.prescriptionListDetails = res;
          this.isLoading = {
            status: false,
            message: '',
          };
        },
        error: (err) => {
          this.TosterService.customToast(
            'Someting went wrong while getting data!',
            'error'
          );
          this.isLoading = {
            status: false,
            message: '',
          };
        },
      });
    } catch (error) {
      this.isLoading = {
        status: false,
        message: '',
      };
    }
  }
  openPdfDialog(id: any): void {
    this.dialog.open(ShowPrescriptionModalComponent, {
      maxWidth: '100%',
      data: { prescriptionId: id },
    });
  }
}
